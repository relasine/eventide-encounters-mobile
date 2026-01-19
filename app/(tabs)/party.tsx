import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback, useRef, useMemo } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion } from '@/contexts/RegionContext';
import { DefendRoll } from '@/components/DefendRoll';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { Character } from '@/constants/types';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PartyScreen() {
  const router = useRouter();
  const { region } = useRegion();
  const colors = Colors.dark;
  const { isTablet } = useResponsive();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  // Check if any character has statuses
  const hasAnyStatuses = useMemo(() => {
    return characters.some(char => char.statuses && char.statuses.length > 0);
  }, [characters]);

  const maxHealthBottomSheetRef = useRef<BottomSheet>(null);
  const maxHealthSnapPoints = useMemo(() => ['40%'], []);

  const positionBottomSheetRef = useRef<BottomSheet>(null);
  const positionSnapPoints = useMemo(() => ['50%'], []);

  const clearStatusesBottomSheetRef = useRef<BottomSheet>(null);
  const clearStatusesSnapPoints = useMemo(() => ['30%'], []);

  const loadCharacters = useCallback(async () => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (charactersJson) {
        const charactersArray = JSON.parse(charactersJson);
        setCharacters(charactersArray);
      } else {
        setCharacters([]);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      setCharacters([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCharacters();
    }, [loadCharacters])
  );

  const handleCreateCharacter = () => {
    router.push('/CreateCharacter');
  };

  const handleUpdateCharacter = useCallback(
    async (updatedCharacter: Character) => {
      try {
        const charactersJson = await AsyncStorage.getItem('characters');
        if (charactersJson) {
          const charactersArray: Character[] = JSON.parse(charactersJson);
          const updatedCharacters = charactersArray.map(char =>
            char.id === updatedCharacter.id ? updatedCharacter : char
          );

          await AsyncStorage.setItem(
            'characters',
            JSON.stringify(updatedCharacters)
          );
          setCharacters(updatedCharacters);
        }
      } catch (error) {
        console.error('Error updating character:', error);
      }
    },
    []
  );

  const handleIncrementHealth = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        currentHealth: Math.min(
          character.maxHealth,
          character.currentHealth + 1
        ),
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleDecrementHealth = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        currentHealth: Math.max(0, character.currentHealth - 1),
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleIncrementSurges = useCallback(
    (character: Character) => {
      if (character.surges === null || character.surges >= 5) return;
      const updated = {
        ...character,
        surges: character.surges + 1,
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleDecrementSurges = useCallback(
    (character: Character) => {
      if (character.surges === null) return;
      const updated = {
        ...character,
        surges: Math.max(0, character.surges - 1),
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleIncrementGlowstone = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        glowstone: character.glowstone + 1,
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleDecrementGlowstone = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        glowstone: Math.max(0, character.glowstone - 1),
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleIncrementEssence = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        essence: character.essence + 1,
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const handleDecrementEssence = useCallback(
    (character: Character) => {
      const updated = {
        ...character,
        essence: Math.max(0, character.essence - 1),
      };
      handleUpdateCharacter(updated);
    },
    [handleUpdateCharacter]
  );

  const openMaxHealthBottomSheet = useCallback((character: Character) => {
    setSelectedCharacter(character);
    maxHealthBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeMaxHealthBottomSheet = useCallback(() => {
    maxHealthBottomSheetRef.current?.close();
    setSelectedCharacter(null);
  }, []);

  const handleIncrementMaxHealth = useCallback(() => {
    if (!selectedCharacter) return;
    const updated = {
      ...selectedCharacter,
      maxHealth: selectedCharacter.maxHealth + 1,
      // Ensure currentHealth doesn't exceed new maxHealth
      currentHealth: Math.min(
        selectedCharacter.currentHealth,
        selectedCharacter.maxHealth + 1
      ),
    };
    handleUpdateCharacter(updated);
    setSelectedCharacter(updated);
  }, [selectedCharacter, handleUpdateCharacter]);

  const handleDecrementMaxHealth = useCallback(() => {
    if (!selectedCharacter) return;
    const updated = {
      ...selectedCharacter,
      maxHealth: Math.max(1, selectedCharacter.maxHealth - 1),
      // Ensure currentHealth doesn't exceed new maxHealth
      currentHealth: Math.min(
        selectedCharacter.currentHealth,
        selectedCharacter.maxHealth - 1
      ),
    };
    handleUpdateCharacter(updated);
    setSelectedCharacter(updated);
  }, [selectedCharacter, handleUpdateCharacter]);

  const renderMaxHealthBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeMaxHealthBottomSheet}
      />
    ),
    [closeMaxHealthBottomSheet]
  );

  const openPositionBottomSheet = useCallback((character: Character) => {
    setSelectedCharacter(character);
    positionBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closePositionBottomSheet = useCallback(() => {
    positionBottomSheetRef.current?.close();
    setSelectedCharacter(null);
  }, []);

  const handlePositionSelect = useCallback(
    async (selectedPosition: 1 | 2 | 3 | 4 | null) => {
      if (!selectedCharacter) return;

      try {
        const charactersJson = await AsyncStorage.getItem('characters');
        if (!charactersJson) return;

        const charactersArray: Character[] = JSON.parse(charactersJson);

        // If selecting a position (1-4), clear all other characters with that position
        if (selectedPosition !== null) {
          charactersArray.forEach(char => {
            if (
              char.position === selectedPosition &&
              char.id !== selectedCharacter.id
            ) {
              char.position = null;
            }
          });
        }

        // Update the current character's position
        const updatedCharacter = {
          ...selectedCharacter,
          position: selectedPosition,
        };
        const updatedArray = charactersArray.map(char =>
          char.id === selectedCharacter.id ? updatedCharacter : char
        );

        await AsyncStorage.setItem('characters', JSON.stringify(updatedArray));
        setCharacters(updatedArray);
        closePositionBottomSheet();
      } catch (error) {
        console.error('Error updating position:', error);
      }
    },
    [selectedCharacter, closePositionBottomSheet]
  );

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

  const openClearStatusesBottomSheet = useCallback((character: Character) => {
    setSelectedCharacter(character);
    clearStatusesBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeClearStatusesBottomSheet = useCallback(() => {
    clearStatusesBottomSheetRef.current?.close();
    setSelectedCharacter(null);
  }, []);

  const handleClearStatuses = useCallback(async () => {
    if (!selectedCharacter) return;

    try {
      const updatedCharacter = {
        ...selectedCharacter,
        statuses: [],
      };
      await handleUpdateCharacter(updatedCharacter);
      closeClearStatusesBottomSheet();
    } catch (error) {
      console.error('Error clearing statuses:', error);
    }
  }, [selectedCharacter, handleUpdateCharacter, closeClearStatusesBottomSheet]);

  const renderClearStatusesBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeClearStatusesBottomSheet}
      />
    ),
    [closeClearStatusesBottomSheet]
  );

  const handleClearAllStatuses = useCallback(async () => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) return;

      const charactersArray: Character[] = JSON.parse(charactersJson);
      const updatedCharacters = charactersArray.map(char => ({
        ...char,
        statuses: [],
      }));

      await AsyncStorage.setItem(
        'characters',
        JSON.stringify(updatedCharacters)
      );
      setCharacters(updatedCharacters);
    } catch (error) {
      console.error('Error clearing all statuses:', error);
    }
  }, []);

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
            <View style={styles.rollButtonsContainer}>
              <DefendRoll />
              <RollSelector />
            </View>
          </View>
          <View style={styles.content}>
            {characters.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>Party</Text>
                <Text style={styles.emptyStateText}>
                  Manage your party members and create new characters
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.charactersContainer,
                  isTablet && styles.charactersContainerTablet,
                ]}
              >
                {[...characters]
                  .sort((a, b) => {
                    // Characters with null position go last
                    if (a.position === null && b.position === null) return 0;
                    if (a.position === null) return 1;
                    if (b.position === null) return -1;
                    // Sort by position number (lowest first)
                    return a.position - b.position;
                  })
                  .map((character, index) => (
                    <View
                      key={index}
                      style={[
                        styles.characterCard,
                        isTablet && styles.characterCardTablet,
                      ]}
                    >
                      <View style={styles.characterCardHeader}>
                        <Text style={styles.characterName}>
                          {character.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: '/CharacterDetails',
                              params: { id: character.id.toString() },
                            })
                          }
                          style={styles.infoButton}
                          activeOpacity={0.7}
                        >
                          <IconSymbol
                            name="info.circle"
                            size={20}
                            color={Colors.dark.textSecondary}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.characterDetails}>
                        <View style={styles.characterDetailRow}>
                          <Text style={styles.characterValueBold}>
                            {character.race.name} {character.class.name}
                          </Text>
                        </View>

                        <View style={styles.positionLevelRow}>
                          <View style={styles.characterDetailRow}>
                            <Text style={styles.characterLabel}>Level: </Text>
                            <Text style={styles.characterValue}>
                              {character.level}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.characterDetailRow}
                            onPress={() => openPositionBottomSheet(character)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.characterLabel}>
                              Position:{' '}
                            </Text>
                            <Text style={styles.characterValue}>
                              {character.position !== null
                                ? character.position
                                : 'N/A'}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.attackDefenseRow}>
                          <View style={styles.characterDetailRow}>
                            <Text style={styles.characterLabel}>ATK: </Text>
                            <Text style={styles.characterValue}>
                              {character.attack}
                            </Text>
                          </View>
                          <View style={styles.characterDetailRow}>
                            <Text style={styles.characterLabel}>DEF: </Text>
                            <Text style={styles.characterValue}>
                              {character.defense}
                            </Text>
                          </View>
                        </View>

                        {character.statuses &&
                          character.statuses.length > 0 && (
                            <View style={styles.statusRow}>
                              <TouchableOpacity
                                onLongPress={() =>
                                  openClearStatusesBottomSheet(character)
                                }
                                activeOpacity={0.7}
                                style={styles.statusLabelContainer}
                              >
                                <Text style={styles.characterLabel}>
                                  Status:{' '}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.statusesContainer}>
                                {character.statuses.map((status, index) => (
                                  <View key={index} style={styles.statusPill}>
                                    <Text style={styles.statusPillText}>
                                      {status}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                      </View>

                      <View style={styles.counterSection}>
                        <View style={styles.counterRow}>
                          <TouchableOpacity
                            onLongPress={() =>
                              openMaxHealthBottomSheet(character)
                            }
                            activeOpacity={0.7}
                          >
                            <Text style={styles.counterLabel}>Health: </Text>
                          </TouchableOpacity>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={() => handleDecrementHealth(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.currentHealth} / {character.maxHealth}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleIncrementHealth(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Surges: </Text>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={() => handleDecrementSurges(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.surges !== null
                                ? character.surges
                                : 'N/A'}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleIncrementSurges(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Glowstone: </Text>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={() =>
                                handleDecrementGlowstone(character)
                              }
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.glowstone}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                handleIncrementGlowstone(character)
                              }
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Essence: </Text>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={() => handleDecrementEssence(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.essence}
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleIncrementEssence(character)}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={17}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </View>
        {hasAnyStatuses && (
          <View style={styles.clearAllStatusesContainer}>
            <TouchableOpacity
              onPress={handleClearAllStatuses}
              style={styles.clearAllStatusesButton}
              activeOpacity={0.7}
            >
              <Text style={styles.clearAllStatusesButtonText}>
                Clear All Statuses
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, isTablet && styles.footerTablet]}>
        <LinearGradient
          colors={colors.accentGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCharacter}
            activeOpacity={0.9}
          >
            <Text style={styles.createButtonText}>Create Character</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <BottomSheet
        ref={maxHealthBottomSheetRef}
        index={-1}
        snapPoints={maxHealthSnapPoints}
        enablePanDownToClose
        backdropComponent={renderMaxHealthBackdrop}
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
              <Text style={styles.bottomSheetHeaderText}>
                {selectedCharacter
                  ? `${selectedCharacter.name}'s Max Health`
                  : 'Max Health'}
              </Text>
              <TouchableOpacity
                onPress={closeMaxHealthBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.maxHealthContainer}>
              <Text style={styles.maxHealthLabel}>Current Max Health:</Text>
              <View style={styles.maxHealthControls}>
                <TouchableOpacity
                  onPress={handleDecrementMaxHealth}
                  style={styles.maxHealthButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="minus" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.maxHealthValue}>
                  {selectedCharacter?.maxHealth ?? 0}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrementMaxHealth}
                  style={styles.maxHealthButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="plus" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </LinearGradient>
      </BottomSheet>

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
          colors={
            colors.backgroundSecondaryGradient as [string, string, ...string[]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetHeaderText}>Select Position</Text>
            <TouchableOpacity
              onPress={closePositionBottomSheet}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.positionOptionsContent}
            showsVerticalScrollIndicator={false}
          >
            {([1, 2, 3, 4, null] as const).map(position => {
              const isSelected = selectedCharacter?.position === position;
              const displayText =
                position !== null ? position.toString() : 'None';
              return (
                <TouchableOpacity
                  key={position !== null ? position : 'none'}
                  style={[
                    styles.positionOption,
                    isSelected && styles.positionOptionSelected,
                  ]}
                  onPress={() => handlePositionSelect(position)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.positionOptionText,
                      isSelected && styles.positionOptionTextSelected,
                    ]}
                  >
                    {displayText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetScrollView>
        </LinearGradient>
      </BottomSheet>

      {/* Clear Statuses Bottom Sheet */}
      <BottomSheet
        ref={clearStatusesBottomSheetRef}
        index={-1}
        snapPoints={clearStatusesSnapPoints}
        enablePanDownToClose
        backdropComponent={renderClearStatusesBackdrop}
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
              <Text style={styles.bottomSheetHeaderText}>Clear Statuses</Text>
              <TouchableOpacity
                onPress={closeClearStatusesBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.clearStatusesContainer}>
              <Text style={styles.clearStatusesText}>
                Are you sure you want to clear all statuses for{' '}
                <Text style={styles.clearStatusesCharacterName}>
                  {selectedCharacter?.name}
                </Text>
                ?
              </Text>

              <TouchableOpacity
                onPress={handleClearStatuses}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'flex-end',
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
  clearAllStatusesContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  clearAllStatusesButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  clearAllStatusesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  content: {
    flex: 1,
    width: '100%',
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
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  createButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  charactersContainer: {
    gap: 16,
  },
  charactersContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characterCard: {
    backgroundColor: 'rgba(21, 21, 32, 0.6)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    width: '100%',
    flexDirection: 'column',
  },
  characterCardTablet: {
    width: '48%',
    marginBottom: 16,
  },
  characterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    flex: 1,
  },
  infoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  characterDetails: {
    gap: 12,
    flex: 1,
  },
  characterDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  positionLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attackDefenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
  },
  characterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.textSecondary,
  },
  characterValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  characterValueBold: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  counterSection: {
    marginTop: 'auto',
    gap: 12,
    paddingTop: 16,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark.textSecondary,
    minWidth: 70,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallCounterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    minWidth: 60,
    textAlign: 'center',
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
  maxHealthContainer: {
    alignItems: 'center',
    gap: 24,
  },
  maxHealthLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  maxHealthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  maxHealthButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maxHealthValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.dark.text,
    minWidth: 80,
    textAlign: 'center',
  },
  positionOptionsContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
  },
  statusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  statusLabelContainer: {
    minWidth: 70,
  },
  clearStatusesContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  clearStatusesText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  clearStatusesCharacterName: {
    fontWeight: '700',
    color: Colors.dark.text,
  },
  clearButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});
