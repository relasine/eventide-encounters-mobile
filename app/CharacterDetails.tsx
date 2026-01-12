import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { Character } from '@/constants/types';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CharacterDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { region } = useRegion();
  const colors = Colors.dark;
  const { isTablet } = useResponsive();
  
  const characterId = params.id !== undefined && params.id !== null ? parseInt(params.id as string, 10) : null;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const positionBottomSheetRef = useRef<BottomSheet>(null);
  const positionSnapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    const loadCharacter = async () => {
      if (characterId === null || characterId === undefined) {
        setError('Character ID is required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const charactersJson = await AsyncStorage.getItem('characters');
        if (!charactersJson) {
          throw new Error('Characters not found in storage');
        }

        const charactersArray: Character[] = JSON.parse(charactersJson);
        const foundCharacter = charactersArray.find((char) => char.id === characterId);

        if (!foundCharacter) {
          throw new Error('Character not found');
        }

        setCharacter(foundCharacter);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error loading character:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  const updateCharacterInStorage = async (updatedCharacter: Character) => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) return;

      const charactersArray: Character[] = JSON.parse(charactersJson);
      const updatedArray = charactersArray.map((char) =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      );

      await AsyncStorage.setItem('characters', JSON.stringify(updatedArray));
      setCharacter(updatedCharacter);
    } catch (error) {
      console.error('Error updating character:', error);
      setError('Failed to update character');
    }
  };

  const openPositionBottomSheet = useCallback(() => {
    positionBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closePositionBottomSheet = useCallback(() => {
    positionBottomSheetRef.current?.close();
  }, []);

  const handlePositionSelect = async (selectedPosition: 1 | 2 | 3 | 4 | null) => {
    if (!character) return;

    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) return;

      const charactersArray: Character[] = JSON.parse(charactersJson);
      
      // If selecting a position (1-4), clear all other characters with that position
      if (selectedPosition !== null) {
        charactersArray.forEach((char) => {
          if (char.position === selectedPosition && char.id !== character.id) {
            char.position = null;
          }
        });
      }

      // Update the current character's position
      const updatedCharacter = { ...character, position: selectedPosition };
      const updatedArray = charactersArray.map((char) =>
        char.id === character.id ? updatedCharacter : char
      );

      await AsyncStorage.setItem('characters', JSON.stringify(updatedArray));
      setCharacter(updatedCharacter);
      closePositionBottomSheet();
    } catch (error) {
      console.error('Error updating position:', error);
      setError('Failed to update position');
    }
  };

  const renderPositionBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closePositionBottomSheet}
      />
    ),
    [closePositionBottomSheet]
  );


  const handleIncrementSurges = () => {
    if (!character || character?.surges === null || character?.surges >= 5) return;
    const updated = { ...character, surges: character.surges + 1 };
    updateCharacterInStorage(updated);
  };

  const handleDecrementSurges = () => {
    if (!character) return;
    const updated = { ...character, surges: Math.max(0, character.surges - 1) };
    updateCharacterInStorage(updated);
  };

  const handleIncrementHealth = () => {
    if (!character) return;
    const updated = { 
      ...character, 
      currentHealth: Math.min(character.maxHealth, character.currentHealth + 1) 
    };
    updateCharacterInStorage(updated);
  };

  const handleDecrementHealth = () => {
    if (!character) return;
    const updated = { 
      ...character, 
      currentHealth: Math.max(0, character.currentHealth - 1) 
    };
    updateCharacterInStorage(updated);
  };

  return (
    <LinearGradient
      colors={colors.backgroundGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            name="chevron.left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{character?.name || 'Character Details'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.contentWrapper,
          isTablet && styles.contentWrapperTablet
        ]}>
          <View style={styles.headerSection}>
            <RegionSelector />
            <RollSelector />
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.loadingText}>Loading character...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : character ? (
              <View style={styles.characterCard}>
                <View style={styles.infoRow}>
                <Text style={styles.label}>Race:</Text>
                    <Text style={styles.value}>{character.race.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Class:</Text>
                    <Text style={styles.value}>{character.class.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Level:</Text>
                    <Text style={styles.value}>{character.level}</Text>
                  </View>

                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Attack:</Text>
                    <Text style={styles.value}>{character.attack}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Defense:</Text>
                    <Text style={styles.value}>{character.defense}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.infoRow}
                    onPress={openPositionBottomSheet}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.label}>Position:</Text>
                    <Text style={styles.value}>
                      {character.position !== null ? character.position : 'N/A'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Racial Ability: </Text>
                    <Text style={styles.abilityName}>{character.race.racialAbility.name}</Text>
                    <Text style={styles.abilityValue}> - {character.race.racialAbility.ability}</Text>
                  </Text>
                </View>

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Class Ability: </Text>
                    <Text style={styles.abilityName}>{character.class.classAbility.name}</Text>
                    <Text style={styles.abilityValue}> - {character.class.classAbility.ability}</Text>
                  </Text>
                </View>

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Class Passive: </Text>
                    <Text style={styles.abilityValue}>{character.class.classPassive}</Text>
                  </Text>
                </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Surges</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      onPress={handleDecrementSurges}
                      style={styles.counterButton}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="minus"
                        size={20}
                        color={Colors.dark.text}
                      />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{character.surges}</Text>
                    <TouchableOpacity
                      onPress={handleIncrementSurges}
                      style={styles.counterButton}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="plus"
                        size={20}
                        color={Colors.dark.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Health</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      onPress={handleDecrementHealth}
                      style={styles.counterButton}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="minus"
                        size={20}
                        color={Colors.dark.text}
                      />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>
                      {character.currentHealth} / {character.maxHealth}
                    </Text>
                    <TouchableOpacity
                      onPress={handleIncrementHealth}
                      style={styles.counterButton}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="plus"
                        size={20}
                        color={Colors.dark.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Position Bottom Sheet */}
      <BottomSheet
        ref={positionBottomSheetRef}
        index={-1}
        snapPoints={positionSnapPoints}
        enablePanDownToClose
        enableContentPanningGesture={false}
        backdropComponent={renderPositionBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <LinearGradient
          colors={colors.backgroundSecondaryGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetHeaderText}>Select Position</Text>
            <TouchableOpacity onPress={closePositionBottomSheet} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <BottomSheetScrollView 
            contentContainerStyle={styles.positionOptionsContent}
            showsVerticalScrollIndicator={false}
          >
            {([1, 2, 3, 4, null] as const).map((position) => {
              const isSelected = character?.position === position;
              const displayText = position !== null ? position.toString() : 'None';
              return (
                <TouchableOpacity
                  key={position !== null ? position : 'none'}
                  style={[styles.positionOption, isSelected && styles.positionOptionSelected]}
                  onPress={() => handlePositionSelect(position)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.positionOptionText, isSelected && styles.positionOptionTextSelected]}>
                    {displayText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetScrollView>
        </LinearGradient>
      </BottomSheet>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  scrollContentTablet: {
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 48,
  },
  contentWrapper: {
    width: '100%',
  },
  contentWrapperTablet: {
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  headerSection: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    width: '100%',
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
  },
  characterCard: {
    backgroundColor: 'rgba(21, 21, 32, 0.6)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.textSecondary,
    marginRight: 12,
    minWidth: 100,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    minWidth: 120,
    textAlign: 'center',
  },
  abilitySection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  abilityText: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  abilityLabel: {
    fontWeight: '600',
    color: Colors.dark.text,
  },
  abilityName: {
    fontStyle: 'italic',
    fontWeight: '600',
    color: Colors.dark.text,
  },
  abilityValue: {
    color: Colors.dark.textSecondary,
    lineHeight: 24,
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
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  positionOptionsContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  positionOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 12,
  },
  positionOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  positionOptionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  positionOptionTextSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});

