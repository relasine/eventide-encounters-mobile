import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { Character, ClassType } from '@/constants/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_KEY, API_URL } from '@/constants';

export default function CharacterDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { region } = useRegion();
  const colors = Colors.dark;
  const { isTablet } = useResponsive();

  const characterId: string | null =
    params.id !== undefined && params.id !== null
      ? (params.id as string)
      : null;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const positionBottomSheetRef = useRef<BottomSheet>(null);
  const positionSnapPoints = useMemo(() => ['50%'], []);

  const maxHealthBottomSheetRef = useRef<BottomSheet>(null);
  const maxHealthSnapPoints = useMemo(() => ['40%'], []);

  const levelBottomSheetRef = useRef<BottomSheet>(null);
  const levelSnapPoints = useMemo(() => ['40%'], []);

  const attackBottomSheetRef = useRef<BottomSheet>(null);
  const attackSnapPoints = useMemo(() => ['40%'], []);

  const defenseBottomSheetRef = useRef<BottomSheet>(null);
  const defenseSnapPoints = useMemo(() => ['40%'], []);

  const classBottomSheetRef = useRef<BottomSheet>(null);
  const classSnapPoints = useMemo(() => ['90%'], []);

  const deleteConfirmationBottomSheetRef = useRef<BottomSheet>(null);
  const deleteConfirmationSnapPoints = useMemo(() => ['30%'], []);

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
        const foundCharacter = charactersArray.find(
          char => char.id === characterId
        );

        if (!foundCharacter) {
          throw new Error('Character not found');
        }

        setCharacter(foundCharacter);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
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
      const updatedArray = charactersArray.map(char =>
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

  const handlePositionSelect = async (
    selectedPosition: 1 | 2 | 3 | 4 | null
  ) => {
    if (!character) return;

    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) return;

      const charactersArray: Character[] = JSON.parse(charactersJson);

      // If selecting a position (1-4), clear all other characters with that position
      if (selectedPosition !== null) {
        charactersArray.forEach(char => {
          if (char.position === selectedPosition && char.id !== character.id) {
            char.position = null;
          }
        });
      }

      // Update the current character's position
      const updatedCharacter = { ...character, position: selectedPosition };
      const updatedArray = charactersArray.map(char =>
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
    if (!character || character?.surges === null || character?.surges >= 5)
      return;
    const updated = { ...character, surges: character.surges + 1 };
    updateCharacterInStorage(updated);
  };

  const handleDecrementSurges = () => {
    if (!character) return;
    const updated = { ...character, surges: Math.max(0, character.surges - 1) };
    updateCharacterInStorage(updated);
  };

  const handleIncrementGlowstone = () => {
    if (!character) return;
    const updated = { ...character, glowstone: character.glowstone + 1 };
    updateCharacterInStorage(updated);
  };

  const handleDecrementGlowstone = () => {
    if (!character) return;
    const updated = {
      ...character,
      glowstone: Math.max(0, character.glowstone - 1),
    };
    updateCharacterInStorage(updated);
  };

  const handleIncrementEssence = () => {
    if (!character) return;
    const updated = { ...character, essence: character.essence + 1 };
    updateCharacterInStorage(updated);
  };

  const handleDecrementEssence = () => {
    if (!character) return;
    const updated = {
      ...character,
      essence: Math.max(0, character.essence - 1),
    };
    updateCharacterInStorage(updated);
  };

  const handleIncrementHealth = () => {
    if (!character) return;
    const updated = {
      ...character,
      currentHealth: Math.min(character.maxHealth, character.currentHealth + 1),
    };
    updateCharacterInStorage(updated);
  };

  const handleDecrementHealth = () => {
    if (!character) return;
    const updated = {
      ...character,
      currentHealth: Math.max(0, character.currentHealth - 1),
    };
    updateCharacterInStorage(updated);
  };

  const openMaxHealthBottomSheet = useCallback(() => {
    maxHealthBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeMaxHealthBottomSheet = useCallback(() => {
    maxHealthBottomSheetRef.current?.close();
  }, []);

  const handleIncrementMaxHealth = useCallback(() => {
    if (!character) return;
    const updated = {
      ...character,
      maxHealth: character.maxHealth + 1,
      // Ensure currentHealth doesn't exceed new maxHealth
      currentHealth: Math.min(character.currentHealth, character.maxHealth + 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const handleDecrementMaxHealth = useCallback(() => {
    if (!character) return;
    const updated = {
      ...character,
      maxHealth: Math.max(1, character.maxHealth - 1),
      // Ensure currentHealth doesn't exceed new maxHealth
      currentHealth: Math.min(character.currentHealth, character.maxHealth - 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

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

  const openLevelBottomSheet = useCallback(() => {
    levelBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeLevelBottomSheet = useCallback(() => {
    levelBottomSheetRef.current?.close();
  }, []);

  const handleIncrementLevel = useCallback(() => {
    if (!character) return;
    const updated = {
      ...character,
      level: character.level + 1,
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const handleDecrementLevel = useCallback(() => {
    if (!character) return;
    const updated = {
      ...character,
      level: Math.max(1, character.level - 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const renderLevelBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeLevelBottomSheet}
      />
    ),
    [closeLevelBottomSheet]
  );

  // Helper functions to convert between string format ("+X", "-X") and number
  const parseStatValue = (value: string): number => {
    if (value.startsWith('+')) {
      return parseInt(value.substring(1), 10) || 0;
    } else if (value.startsWith('-')) {
      return parseInt(value, 10) || 0;
    } else {
      // Handle case where value might just be a number string
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
  };

  const formatStatValue = (value: number): string => {
    if (value >= 0) {
      return `+${value}`;
    } else {
      return `${value}`;
    }
  };

  const openAttackBottomSheet = useCallback(() => {
    attackBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeAttackBottomSheet = useCallback(() => {
    attackBottomSheetRef.current?.close();
  }, []);

  const handleIncrementAttack = useCallback(() => {
    if (!character) return;
    const currentValue = parseStatValue(character.attack);
    const updated = {
      ...character,
      attack: formatStatValue(currentValue + 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const handleDecrementAttack = useCallback(() => {
    if (!character) return;
    const currentValue = parseStatValue(character.attack);
    const updated = {
      ...character,
      attack: formatStatValue(currentValue - 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const renderAttackBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeAttackBottomSheet}
      />
    ),
    [closeAttackBottomSheet]
  );

  const openDefenseBottomSheet = useCallback(() => {
    defenseBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeDefenseBottomSheet = useCallback(() => {
    defenseBottomSheetRef.current?.close();
  }, []);

  const handleIncrementDefense = useCallback(() => {
    if (!character) return;
    const currentValue = parseStatValue(character.defense);
    const updated = {
      ...character,
      defense: formatStatValue(currentValue + 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const handleDecrementDefense = useCallback(() => {
    if (!character) return;
    const currentValue = parseStatValue(character.defense);
    const updated = {
      ...character,
      defense: formatStatValue(currentValue - 1),
    };
    updateCharacterInStorage(updated);
  }, [character, updateCharacterInStorage]);

  const renderDefenseBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeDefenseBottomSheet}
      />
    ),
    [closeDefenseBottomSheet]
  );

  const openClassBottomSheet = useCallback(async () => {
    setIsLoadingClasses(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/classes`, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch classes: ${response.status} ${response.statusText}`
        );
      }

      const classesData = await response.json();

      if (!classesData || !classesData.classes) {
        throw new Error('Invalid response format from classes endpoint');
      }

      setClasses(classesData.classes);
      classBottomSheetRef.current?.snapToIndex(0);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  const closeClassBottomSheet = useCallback(() => {
    classBottomSheetRef.current?.close();
  }, []);

  const handleClassSelect = async (selectedClass: ClassType) => {
    if (!character) return;

    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) return;

      const charactersArray: Character[] = JSON.parse(charactersJson);

      // Find the matching class in the classes array
      const matchingClass = classes.find(c => c.name === selectedClass.name);

      if (!matchingClass) {
        setError('Selected class not found in classes array');
        return;
      }

      // Update the character with the new class
      const updatedCharacter = { ...character, class: matchingClass };
      const updatedArray = charactersArray.map(char =>
        char.id === character.id ? updatedCharacter : char
      );

      await AsyncStorage.setItem('characters', JSON.stringify(updatedArray));
      setCharacter(updatedCharacter);
      closeClassBottomSheet();
    } catch (error) {
      console.error('Error updating class:', error);
      setError('Failed to update class');
    }
  };

  const renderClassBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeClassBottomSheet}
      />
    ),
    [closeClassBottomSheet]
  );

  const openDeleteConfirmation = useCallback(() => {
    deleteConfirmationBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeDeleteConfirmation = useCallback(() => {
    deleteConfirmationBottomSheetRef.current?.close();
  }, []);

  const handleDeleteCharacter = useCallback(async () => {
    if (!character) return;

    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (charactersJson) {
        const charactersArray: Character[] = JSON.parse(charactersJson);
        // Remove the character that matches the one to delete
        const updatedCharacters = charactersArray.filter(
          char => char.id !== character.id
        );

        // Save updated array back to AsyncStorage
        await AsyncStorage.setItem(
          'characters',
          JSON.stringify(updatedCharacters)
        );
      }
      closeDeleteConfirmation();
      // Navigate back to party screen
      router.push('/(tabs)/party');
    } catch (error) {
      console.error('Error deleting character:', error);
      setError('Failed to delete character');
    }
  }, [character, closeDeleteConfirmation, router]);

  const renderDeleteConfirmationBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeDeleteConfirmation}
      />
    ),
    [closeDeleteConfirmation]
  );

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
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {character?.name || 'Character Details'}
        </Text>
        <View style={styles.placeholder} />
      </View>

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
          <View style={styles.headerSection}>
            <RegionSelector />
            <RollSelector />
          </View>

          {character && (
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>
                {character.name} - {character.race.name} {character.class.name}
              </Text>
            </View>
          )}

          <View style={styles.content}>
            {isLoading || isLoadingClasses ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.loadingText}>
                  {isLoading ? 'Loading character...' : 'Loading classes...'}
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : character ? (
              <View style={styles.characterCard}>
                <View
                  style={[
                    styles.infoContainer,
                    isTablet && styles.infoContainerTablet,
                  ]}
                >
                  <View
                    style={[
                      styles.infoColumn,
                      isTablet && styles.infoColumnTablet,
                    ]}
                  >
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Race:</Text>
                      <Text style={styles.value}>{character.race.name}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.infoRow}
                      onPress={openClassBottomSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>Class:</Text>
                      <Text style={styles.value}>{character.class.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoRow}
                      onPress={openLevelBottomSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>Level:</Text>
                      <Text style={styles.value}>{character.level}</Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[styles.section, isTablet && styles.sectionTablet]}
                  >
                    <TouchableOpacity
                      style={styles.infoRow}
                      onPress={openAttackBottomSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>Attack:</Text>
                      <Text style={styles.value}>{character.attack}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoRow}
                      onPress={openDefenseBottomSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>Defense:</Text>
                      <Text style={styles.value}>{character.defense}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoRow}
                      onPress={openPositionBottomSheet}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>Position:</Text>
                      <Text style={styles.value}>
                        {character.position !== null
                          ? character.position
                          : 'N/A'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.counterSection}>
                  <View
                    style={[
                      styles.counterRowContainer,
                      isTablet && styles.counterRowContainerTablet,
                    ]}
                  >
                    <View
                      style={[
                        styles.counterRow,
                        isTablet && styles.counterRowTablet,
                      ]}
                    >
                      <TouchableOpacity
                        onLongPress={openMaxHealthBottomSheet}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.counterLabel}>Health: </Text>
                      </TouchableOpacity>
                      <View style={styles.counterControls}>
                        <TouchableOpacity
                          onPress={handleDecrementHealth}
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
                          onPress={handleIncrementHealth}
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

                    <View
                      style={[
                        styles.counterRow,
                        isTablet && styles.counterRowTablet,
                      ]}
                    >
                      <Text style={styles.counterLabel}>Surges: </Text>
                      <View style={styles.counterControls}>
                        <TouchableOpacity
                          onPress={handleDecrementSurges}
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
                          {character.surges !== null ? character.surges : 'N/A'}
                        </Text>
                        <TouchableOpacity
                          onPress={handleIncrementSurges}
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

                    <View
                      style={[
                        styles.counterRow,
                        isTablet && styles.counterRowTablet,
                      ]}
                    >
                      <Text style={styles.counterLabel}>Glowstone: </Text>
                      <View style={styles.counterControls}>
                        <TouchableOpacity
                          onPress={handleDecrementGlowstone}
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
                          onPress={handleIncrementGlowstone}
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

                    <View
                      style={[
                        styles.counterRow,
                        isTablet && styles.counterRowTablet,
                      ]}
                    >
                      <Text style={styles.counterLabel}>Essence: </Text>
                      <View style={styles.counterControls}>
                        <TouchableOpacity
                          onPress={handleDecrementEssence}
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
                          onPress={handleIncrementEssence}
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

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Racial Ability: </Text>
                    <Text style={styles.abilityName}>
                      {character.race.racialAbility.name}
                    </Text>
                    <Text style={styles.abilityValue}>
                      {' '}
                      - {character.race.racialAbility.ability}
                    </Text>
                  </Text>
                </View>

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Class Ability: </Text>
                    <Text style={styles.abilityName}>
                      {character.class.classAbility.name}
                    </Text>
                    <Text style={styles.abilityValue}>
                      {' '}
                      - {character.class.classAbility.ability}
                    </Text>
                  </Text>
                </View>

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityText}>
                    <Text style={styles.abilityLabel}>Class Passive: </Text>
                    <Text style={styles.abilityValue}>
                      {character.class.classPassive}
                    </Text>
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Delete Character Button */}
      {character && (
        <View style={[styles.footer, isTablet && styles.footerTablet]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={openDeleteConfirmation}
            activeOpacity={0.9}
          >
            <Text style={styles.deleteButtonText}>Delete Character</Text>
          </TouchableOpacity>
        </View>
      )}

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
              const isSelected = character?.position === position;
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

      {/* Max Health Bottom Sheet */}
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
                {character ? `${character.name}'s Max Health` : 'Max Health'}
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
                  {character?.maxHealth ?? 0}
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

      {/* Level Bottom Sheet */}
      <BottomSheet
        ref={levelBottomSheetRef}
        index={-1}
        snapPoints={levelSnapPoints}
        enablePanDownToClose
        backdropComponent={renderLevelBackdrop}
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
                {character ? `${character.name}'s Level` : 'Level'}
              </Text>
              <TouchableOpacity
                onPress={closeLevelBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.maxHealthContainer}>
              <Text style={styles.maxHealthLabel}>Current Level:</Text>
              <View style={styles.maxHealthControls}>
                <TouchableOpacity
                  onPress={handleDecrementLevel}
                  style={styles.maxHealthButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="minus" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.maxHealthValue}>
                  {character?.level ?? 1}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrementLevel}
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

      {/* Attack Bottom Sheet */}
      <BottomSheet
        ref={attackBottomSheetRef}
        index={-1}
        snapPoints={attackSnapPoints}
        enablePanDownToClose
        backdropComponent={renderAttackBackdrop}
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
                {character ? `${character.name}'s Attack` : 'Attack'}
              </Text>
              <TouchableOpacity
                onPress={closeAttackBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.maxHealthContainer}>
              <Text style={styles.maxHealthLabel}>Current Attack:</Text>
              <View style={styles.maxHealthControls}>
                <TouchableOpacity
                  onPress={handleDecrementAttack}
                  style={styles.maxHealthButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="minus" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.maxHealthValue}>
                  {character ? character.attack : '+0'}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrementAttack}
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

      {/* Defense Bottom Sheet */}
      <BottomSheet
        ref={defenseBottomSheetRef}
        index={-1}
        snapPoints={defenseSnapPoints}
        enablePanDownToClose
        backdropComponent={renderDefenseBackdrop}
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
                {character ? `${character.name}'s Defense` : 'Defense'}
              </Text>
              <TouchableOpacity
                onPress={closeDefenseBottomSheet}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.maxHealthContainer}>
              <Text style={styles.maxHealthLabel}>Current Defense:</Text>
              <View style={styles.maxHealthControls}>
                <TouchableOpacity
                  onPress={handleDecrementDefense}
                  style={styles.maxHealthButton}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="minus" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.maxHealthValue}>
                  {character ? character.defense : '+0'}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrementDefense}
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

      {/* Class Bottom Sheet */}
      <BottomSheet
        ref={classBottomSheetRef}
        index={-1}
        snapPoints={classSnapPoints}
        enablePanDownToClose
        enableContentPanningGesture={false}
        backdropComponent={renderClassBackdrop}
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
            <Text style={styles.bottomSheetHeaderText}>Select Class</Text>
            <TouchableOpacity
              onPress={closeClassBottomSheet}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.positionOptionsContent}
            showsVerticalScrollIndicator={false}
          >
            {classes.map(classType => {
              const isSelected = character?.class.name === classType.name;
              return (
                <TouchableOpacity
                  key={classType.name}
                  style={[
                    styles.positionOption,
                    isSelected && styles.positionOptionSelected,
                  ]}
                  onPress={() => handleClassSelect(classType)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.positionOptionText,
                      isSelected && styles.positionOptionTextSelected,
                    ]}
                  >
                    {classType.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetScrollView>
        </LinearGradient>
      </BottomSheet>

      {/* Delete Confirmation Bottom Sheet */}
      <BottomSheet
        ref={deleteConfirmationBottomSheetRef}
        index={-1}
        snapPoints={deleteConfirmationSnapPoints}
        enablePanDownToClose
        backdropComponent={renderDeleteConfirmationBackdrop}
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
              <Text style={styles.bottomSheetHeaderText}>Delete Character</Text>
              <TouchableOpacity
                onPress={closeDeleteConfirmation}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deleteConfirmationContainer}>
              <Text style={styles.deleteConfirmationText}>
                Are you sure you want to delete{' '}
                <Text style={styles.deleteConfirmationCharacterName}>
                  {character?.name}
                </Text>
                ? This action cannot be undone.
              </Text>

              <View style={styles.deleteConfirmationButtons}>
                <TouchableOpacity
                  onPress={closeDeleteConfirmation}
                  style={styles.deleteCancelButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteCharacter}
                  style={styles.deleteConfirmButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    paddingBottom: 100,
  },
  scrollContentTablet: {
    paddingHorizontal: 40,
    paddingTop: 32,
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
  headerSection: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
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
  infoContainer: {
    width: '100%',
  },
  infoContainerTablet: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  },
  infoColumn: {
    width: '100%',
  },
  infoColumnTablet: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  sectionTablet: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    flex: 1,
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
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    minWidth: 60,
    textAlign: 'center',
  },
  counterSection: {
    marginTop: 12,
    marginBottom: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  counterRowContainer: {
    width: '100%',
  },
  counterRowContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'flex-start',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  counterRowTablet: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 0,
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
    gap: 8,
  },
  smallCounterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomSheetContent: {
    padding: 24,
    paddingBottom: 40,
    flex: 1,
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
  deleteButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  deleteConfirmationContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  deleteConfirmationText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  deleteConfirmationCharacterName: {
    fontWeight: '700',
    color: Colors.dark.text,
  },
  deleteConfirmationButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  deleteCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  deleteConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});
