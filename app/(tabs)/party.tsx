import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
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

  const handleDeleteCharacter = useCallback(async (characterToDelete: Character) => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (charactersJson) {
        const charactersArray: Character[] = JSON.parse(charactersJson);
        // Remove the character that matches the one to delete
        const updatedCharacters = charactersArray.filter(
          (char) => !(
            char.id === characterToDelete.id
          )
        );
        
        // Save updated array back to AsyncStorage
        await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
        
        // Update local state
        setCharacters(updatedCharacters);
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  }, []);

  const handleUpdateCharacter = useCallback(async (updatedCharacter: Character) => {
    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (charactersJson) {
        const charactersArray: Character[] = JSON.parse(charactersJson);
        const updatedCharacters = charactersArray.map((char) =>
          char.id === updatedCharacter.id ? updatedCharacter : char
        );
        
        await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
        setCharacters(updatedCharacters);
      }
    } catch (error) {
      console.error('Error updating character:', error);
    }
  }, []);

  const handleIncrementHealth = useCallback((character: Character) => {
    const updated = {
      ...character,
      currentHealth: Math.min(character.maxHealth, character.currentHealth + 1)
    };
    handleUpdateCharacter(updated);
  }, [handleUpdateCharacter]);

  const handleDecrementHealth = useCallback((character: Character) => {
    const updated = {
      ...character,
      currentHealth: Math.max(0, character.currentHealth - 1)
    };
    handleUpdateCharacter(updated);
  }, [handleUpdateCharacter]);

  const handleIncrementSurges = useCallback((character: Character) => {
    if (character.surges === null || character.surges >= 5) return;
    const updated = {
      ...character,
      surges: character.surges + 1
    };
    handleUpdateCharacter(updated);
  }, [handleUpdateCharacter]);

  const handleDecrementSurges = useCallback((character: Character) => {
    if (character.surges === null) return;
    const updated = {
      ...character,
      surges: Math.max(0, character.surges - 1)
    };
    handleUpdateCharacter(updated);
  }, [handleUpdateCharacter]);

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
          isTablet && styles.scrollContentTablet
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.contentWrapper,
          isTablet && styles.contentWrapperTablet
        ]}>
          <View style={styles.header}>
            <RegionSelector />
            <RollSelector />
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
              <View style={[
                styles.charactersContainer,
              ]}>
                {characters.map((character, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.characterCard}
                    onPress={() => router.push({
                      pathname: '/CharacterDetails',
                      params: { id: character.id.toString() }
                    })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.characterCardHeader}>
                      <Text style={styles.characterName}>{character.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteCharacter(character)}
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                      >
                        <IconSymbol
                          name="trash"
                          size={20}
                          color={Colors.dark.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.characterDetails}>
                      <View style={styles.characterDetailRow}>
                        <Text style={styles.characterValueBold}>{character.race.name} {character.class.name }</Text>
                      </View>

                      <View style={styles.characterDetailRow}>
                        <Text style={styles.characterLabel}>Position: </Text>
                        <Text style={styles.characterValue}>
                          {character.position !== null ? character.position : 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.counterSection}>
                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Health: </Text>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDecrementHealth(character);
                              }}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={14}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.currentHealth} / {character.maxHealth}
                            </Text>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleIncrementHealth(character);
                              }}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={14}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.counterRow}>
                          <Text style={styles.counterLabel}>Surges: </Text>
                          <View style={styles.counterControls}>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDecrementSurges(character);
                              }}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="minus"
                                size={14}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                            <Text style={styles.counterValue}>
                              {character.surges !== null ? character.surges : 'N/A'}
                            </Text>
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleIncrementSurges(character);
                              }}
                              style={styles.smallCounterButton}
                              activeOpacity={0.7}
                            >
                              <IconSymbol
                                name="plus"
                                size={14}
                                color={Colors.dark.text}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[
        styles.footer,
        isTablet && styles.footerTablet
      ]}>
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
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  characterDetails: {
    gap: 12,
  },
  characterDetailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginTop: 12,
    gap: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    minWidth: 70,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallCounterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
});

