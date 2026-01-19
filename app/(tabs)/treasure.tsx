import { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { DefendRoll } from '@/components/DefendRoll';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { API_KEY, API_URL } from '@/constants';
import { useResponsive } from '@/hooks/use-responsive';
import {
  Character,
  Weapon,
  Shield,
  LuniteShard,
  BackpackItem,
} from '@/constants/types';

type WeaponTreasure = {
  weaponType: 'Arcane' | 'Ranged' | 'Melee';
  type: 'One-Handed' | 'Two-Handed';
  name: string;
  charges: 0 | 1 | 2 | 3 | 4 | 5 | null;
  actionType: 'Free Action' | 'Primary Action' | null;
  action: string;
};

type ShardTreasure = {
  name: string;
  type: 'Lunite Shard';
  action: string;
  stacking: 'stacking' | 'non-stacking' | 'stacking x2' | null;
};

type ShieldTreasure = {
  name: string;
  type: 'Shield';
  action: string;
  stacking: 'stacking' | 'non-stacking' | 'stacking x2' | null;
};

type TreasureResponse = {
  item: WeaponTreasure | ShardTreasure | ShieldTreasure;
  glowstone: number;
};

export default function TreasureScreen() {
  const { region } = useRegion();
  const [treasureResults, setTreasureResults] =
    useState<TreasureResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const colors = Colors.dark;
  const { isTablet } = useResponsive();

  const characterBottomSheetRef = useRef<BottomSheet>(null);
  const characterSnapPoints = useMemo(() => ['65%'], []);

  const search = async () => {
    setIsLoading(true);
    setTreasureResults(null);
    setError(null);
    setIsAssigned(false);

    try {
      const response = await fetch(`${API_URL}/api/v1/treasure/${region}`, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch treasure: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data || !data.treasure) {
        throw new Error('Invalid response format from server');
      }

      setTreasureResults(data.treasure);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching treasure:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWeapon = (
    item: WeaponTreasure | ShardTreasure | ShieldTreasure
  ): item is WeaponTreasure => {
    return item.type === 'One-Handed' || item.type === 'Two-Handed';
  };

  const isShardOrShield = (
    item: WeaponTreasure | ShardTreasure | ShieldTreasure
  ): item is ShardTreasure | ShieldTreasure => {
    return item.type === 'Lunite Shard' || item.type === 'Shield';
  };

  const loadCharacters = useCallback(async () => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (charactersJson) {
        const charactersArray: Character[] = JSON.parse(charactersJson);

        if (!treasureResults?.item) {
          setCharacters(charactersArray);
          return;
        }

        const item = treasureResults.item;
        const isWeaponOrShield = isWeapon(item) || item.type === 'Shield';

        // Filter characters based on item type
        const filteredCharacters = charactersArray.filter(character => {
          if (isWeaponOrShield) {
            return (character.weaponsAndShield?.length ?? 0) < 4;
          } else {
            return (character.backpack?.length ?? 0) < 10;
          }
        });

        setCharacters(filteredCharacters);
      } else {
        setCharacters([]);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      setCharacters([]);
    }
  }, [treasureResults]);

  const openCharacterBottomSheet = useCallback(() => {
    loadCharacters();
    characterBottomSheetRef.current?.snapToIndex(0);
  }, [loadCharacters]);

  const closeCharacterBottomSheet = useCallback(() => {
    characterBottomSheetRef.current?.close();
  }, []);

  const handleAssignToCharacter = useCallback(
    async (character: Character) => {
      if (!treasureResults?.item) return;

      setIsAssigning(true);
      setError(null);

      try {
        const charactersJson = await AsyncStorage.getItem('characters');
        if (!charactersJson) {
          throw new Error('Characters not found in storage');
        }

        const charactersArray: Character[] = JSON.parse(charactersJson);
        const characterIndex = charactersArray.findIndex(
          char => char.id === character.id
        );

        if (characterIndex === -1) {
          throw new Error('Character not found');
        }

        const item = treasureResults.item;

        if (isWeapon(item)) {
          // Create Weapon object
          const weaponTypeMap: Record<
            'Arcane' | 'Ranged' | 'Melee',
            'arcane' | 'ranged' | 'melee'
          > = {
            Arcane: 'arcane',
            Ranged: 'ranged',
            Melee: 'melee',
          };

          const actionTypeMap: Record<
            'Free Action' | 'Primary Action',
            'free action' | 'primary action'
          > = {
            'Free Action': 'free action',
            'Primary Action': 'primary action',
          };

          const newWeapon: Weapon = {
            name: `${item.type} ${item.weaponType} Weapon`,
            handed: item.type === 'One-Handed' ? 1 : 2,
            type: weaponTypeMap[item.weaponType],
            maxCharges:
              item.charges === 0 || item.charges === null
                ? null
                : (item.charges as 1 | 2 | 3 | 4 | 5),
            currentCharge:
              item.charges === 0 || item.charges === null
                ? null
                : (item.charges as 0 | 1 | 2 | 3 | 4 | 5),
            abilityName: item.name,
            ability: item.action,
            actionType: item.actionType ? actionTypeMap[item.actionType] : null,
            equipped: false,
          };

          const currentWeapons =
            charactersArray[characterIndex].weaponsAndShield || [];
          charactersArray[characterIndex].weaponsAndShield = [
            ...currentWeapons,
            newWeapon,
          ] as any;
        } else if (item.type === 'Shield') {
          // Create Shield object
          const newShield: Shield = {
            name: item.name,
            ability: item.action || null,
            equipped: false,
          };

          const currentWeapons =
            charactersArray[characterIndex].weaponsAndShield || [];
          charactersArray[characterIndex].weaponsAndShield = [
            ...currentWeapons,
            newShield,
          ] as any;
        } else if (item.type === 'Lunite Shard') {
          // Create LuniteShard and add to backpack
          const newShard: LuniteShard = {
            name: item.name,
            action: item.action,
            stacking: item.stacking,
            isEquipped: false,
          };

          charactersArray[characterIndex].backpack = [
            ...(charactersArray[characterIndex].backpack || []),
            newShard,
          ];
        }

        await AsyncStorage.setItem(
          'characters',
          JSON.stringify(charactersArray)
        );
        setIsAssigned(true);
        closeCharacterBottomSheet();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error assigning item to character:', error);
      } finally {
        setIsAssigning(false);
      }
    },
    [treasureResults, closeCharacterBottomSheet]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeCharacterBottomSheet}
      />
    ),
    [closeCharacterBottomSheet]
  );

  return (
    <LinearGradient
      colors={colors.backgroundGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.contentWrapper,
            isTablet && styles.contentWrapperTablet,
          ]}
        >
          <View style={styles.header}>
            <RegionSelector />
            <View
              style={[
                styles.rollButtonsContainer,
                !isTablet && styles.rollButtonsContainerMobile,
              ]}
            >
              {isTablet && <DefendRoll />}
              <RollSelector />
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Discovering treasure...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={search}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : treasureResults ? (
            <View style={styles.treasureCard}>
              {treasureResults.item ? (
                <View style={styles.itemSection}>
                  <View style={styles.itemHeader}>
                    {isWeapon(treasureResults.item) ? (
                      <Text style={styles.itemTitle}>
                        {`${treasureResults.item.type} ${treasureResults.item.weaponType} Weapon`}
                      </Text>
                    ) : (
                      <Text style={styles.itemTitle}>
                        {treasureResults.item.type}
                      </Text>
                    )}
                  </View>

                  <View style={styles.effectSection}>
                    <Text style={styles.effectLabel}>Effect</Text>
                    <Text style={styles.effectName}>
                      {treasureResults.item.name}
                    </Text>
                    <Text style={styles.effectAction}>
                      {treasureResults.item.action}
                    </Text>
                  </View>

                  {isWeapon(treasureResults.item) &&
                    treasureResults.item.actionType && (
                      <View style={styles.propertyRow}>
                        <Text style={styles.propertyLabel}>Action Type</Text>
                        <Text style={styles.propertyValue}>
                          {treasureResults.item.actionType}
                        </Text>
                      </View>
                    )}

                  {isWeapon(treasureResults.item) && (
                    <View style={styles.propertyRow}>
                      <Text style={styles.propertyLabel}>Charges</Text>
                      <Text style={styles.propertyValue}>
                        {treasureResults.item.charges}
                      </Text>
                    </View>
                  )}

                  {isShardOrShield(treasureResults.item) &&
                    treasureResults.item.stacking && (
                      <View style={styles.propertyRow}>
                        <Text style={styles.propertyLabel}>Stacking</Text>
                        <Text style={styles.propertyValue}>
                          {treasureResults.item.stacking}
                        </Text>
                      </View>
                    )}

                  <TouchableOpacity
                    style={[
                      styles.assignButton,
                      isAssigned && styles.assignButtonDisabled,
                    ]}
                    onPress={openCharacterBottomSheet}
                    activeOpacity={0.7}
                    disabled={isAssigned}
                  >
                    <Text style={styles.assignButtonText}>
                      Assign to character
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {treasureResults.glowstone ? (
                <View style={styles.glowstoneSection}>
                  <Text style={styles.glowstoneLabel}>Glowstone</Text>
                  <Text style={styles.glowstoneValue}>
                    {treasureResults.glowstone}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Discover Treasure</Text>
              <Text style={styles.emptyStateText}>
                Use the button below to discover treasure in your region
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, isTablet && styles.footerTablet]}>
        <LinearGradient
          colors={colors.accentGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <TouchableOpacity
            style={[
              styles.treasureButton,
              isLoading && styles.treasureButtonDisabled,
            ]}
            onPress={search}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <Text style={styles.treasureButtonText}>Discover Treasure</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <BottomSheet
        ref={characterBottomSheetRef}
        index={-1}
        snapPoints={characterSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <LinearGradient
          colors={
            colors.backgroundSecondaryGradient as [string, string, ...string[]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetHeaderText}>Select Character</Text>
              <TouchableOpacity
                onPress={closeCharacterBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {characters.length === 0 ? (
              <View style={styles.noCharactersContainer}>
                <Text style={styles.noCharactersText}>
                  {treasureResults?.item &&
                  (isWeapon(treasureResults.item) ||
                    treasureResults.item.type === 'Shield')
                    ? 'No characters with fewer than 4 weapons or shields'
                    : 'No characters with fewer than 10 backpack items'}
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.charactersList}
                showsVerticalScrollIndicator={false}
              >
                {characters.map(character => (
                  <TouchableOpacity
                    key={character.id}
                    style={styles.characterOption}
                    onPress={() => handleAssignToCharacter(character)}
                    activeOpacity={0.7}
                    disabled={isAssigning}
                  >
                    <Text style={styles.characterName}>{character.name}</Text>
                    <Text style={styles.characterDetails}>
                      {character.race.name} {character.class.name} (Level{' '}
                      {character.level})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </BottomSheetView>
        </LinearGradient>
      </BottomSheet>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  scrollContentTablet: {
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 120,
  },
  contentWrapper: {
    width: '100%',
  },
  contentWrapperTablet: {
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rollButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  rollButtonsContainerMobile: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 8,
  },
  treasureCard: {
    backgroundColor: 'rgba(21, 21, 32, 0.6)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    width: '100%',
  },
  itemSection: {
    marginBottom: 20,
  },
  itemHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  effectSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    marginBottom: 16,
  },
  effectLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  effectName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.accent,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  effectAction: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  propertyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  glowstoneSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    marginTop: 20,
  },
  glowstoneLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  glowstoneValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    backgroundColor: Colors.dark.backgroundPrimary,
  },
  footerTablet: {
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 20,
  },
  buttonGradient: {
    borderRadius: 14,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  treasureButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  treasureButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  treasureButtonDisabled: {
    opacity: 0.6,
  },
  assignButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  assignButtonDisabled: {
    opacity: 0.6,
  },
  bottomSheetBackground: {
    backgroundColor: 'transparent',
  },
  gradientBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: Colors.dark.border,
    width: 40,
  },
  bottomSheetContent: {
    padding: 24,
    paddingBottom: 40,
    flex: 1,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  bottomSheetHeaderText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.dark.textSecondary,
    fontWeight: '300',
  },
  noCharactersContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCharactersText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  charactersList: {
    flex: 1,
  },
  characterOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  characterDetails: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
