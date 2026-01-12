import { View, StyleSheet, TouchableOpacity, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RaceType, ClassType, Character } from '@/constants/types';
import { API_KEY, API_URL } from '@/constants';

export default function CreateCharacterScreen() {
  const router = useRouter();
  const colors = Colors.dark;

  const [races, setRaces] = useState<RaceType[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [name, setName] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<RaceType | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const raceBottomSheetRef = useRef<BottomSheet>(null);
  const classBottomSheetRef = useRef<BottomSheet>(null);

  const raceSnapPoints = useRef(['90%']);
  const classSnapPoints = useRef(['90%']);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [racesResponse, classesResponse] = await Promise.all([
          fetch(`${API_URL}/api/v1/races`, {
            headers: {
              'x-api-key': API_KEY,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_URL}/api/v1/classes`, {
            headers: {
              'x-api-key': API_KEY,
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (!racesResponse.ok) {
          throw new Error(`Failed to fetch races: ${racesResponse.status} ${racesResponse.statusText}`);
        }

        if (!classesResponse.ok) {
          throw new Error(`Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`);
        }

        const racesData = await racesResponse.json();
        const classesData = await classesResponse.json();

        if (!racesData || !racesData.races) {
          throw new Error('Invalid response format from races endpoint');
        }

        if (!classesData || !classesData.classes) {
          throw new Error('Invalid response format from classes endpoint');
        }

        setRaces(racesData.races);
        setClasses(classesData.classes);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error fetching character data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openRaceBottomSheet = useCallback(() => {
    raceBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeRaceBottomSheet = useCallback(() => {
    raceBottomSheetRef.current?.close();
  }, []);

  const openClassBottomSheet = useCallback(() => {
    classBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeClassBottomSheet = useCallback(() => {
    classBottomSheetRef.current?.close();
  }, []);

  const handleRaceSelect = (race: RaceType) => {
    setSelectedRace(race);
    closeRaceBottomSheet();
  };

  const handleClassSelect = (classType: ClassType) => {
    setSelectedClass(classType);
    closeClassBottomSheet();
  };

  const renderRaceBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeRaceBottomSheet}
      />
    ),
    [closeRaceBottomSheet]
  );

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

  const isSubmitDisabled = name.length <= 1 || !selectedRace || !selectedClass;

  const handleSubmit = async () => {
    if (!selectedRace || !selectedClass) return;

    // Find the matching class in the classes array
    const matchingClass = classes.find(c => c.name === selectedClass.name);
    
    if (!matchingClass) {
      setError('Selected class not found in classes array');
      return;
    }

    try {
      // Get existing characters from AsyncStorage
      const charactersJson = await AsyncStorage.getItem('characters');
      
      let charactersArray: Character[] = [];
      
      if (charactersJson) {
        // Parse existing characters array
        charactersArray = JSON.parse(charactersJson);
      }

       // Create the character object
    const newCharacter: Character = {
        name: name.trim(),
        race: selectedRace,
        class: selectedClass,
        level: 1,
        surges: 0,
        attack: selectedRace.attack,
        defense: selectedRace.defense,
        maxHealth: selectedRace.health,
        currentHealth: selectedRace.health,
        position: null,
        id: charactersArray.length,
      };
      
      // Add the new character to the array
      charactersArray.push(newCharacter);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      
      // Navigate back after successful creation
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save character';
      setError(errorMessage);
      console.error('Error saving character:', error);
    }
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
        <Text style={styles.title}>Create Character</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter character name"
                  placeholderTextColor={Colors.dark.textTertiary}
                />
              </View>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={openRaceBottomSheet}
                activeOpacity={0.7}
              >
                <Text style={styles.selectButtonText}>
                  {selectedRace ? selectedRace.name : 'Select Race'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={openClassBottomSheet}
                activeOpacity={0.7}
              >
                <Text style={styles.selectButtonText}>
                  {selectedClass ? selectedClass.name : 'Select Class'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {!isLoading && !error && (
        <View style={styles.footer}>
          <LinearGradient
            colors={colors.accentGradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.submitButtonGradient, isSubmitDisabled && styles.submitButtonDisabled]}
          >
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.9}
              disabled={isSubmitDisabled}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Race Bottom Sheet */}
      <BottomSheet
        ref={raceBottomSheetRef}
        index={-1}
        snapPoints={raceSnapPoints.current}
        enablePanDownToClose
        enableContentPanningGesture={false}
        backdropComponent={renderRaceBackdrop}
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
            <Text style={styles.bottomSheetHeaderText}>Select Race</Text>
            <TouchableOpacity onPress={closeRaceBottomSheet} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <BottomSheetScrollView 
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {races.map((race) => {
              const isSelected = selectedRace?.name === race.name;
              return (
                <TouchableOpacity
                  key={race.name}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleRaceSelect(race)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {race.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetScrollView>
        </LinearGradient>
      </BottomSheet>

      {/* Class Bottom Sheet */}
      <BottomSheet
        ref={classBottomSheetRef}
        index={-1}
        snapPoints={classSnapPoints.current}
        enablePanDownToClose
        enableContentPanningGesture={false}
        backdropComponent={renderClassBackdrop}
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
            <Text style={styles.bottomSheetHeaderText}>Select Class</Text>
            <TouchableOpacity onPress={closeClassBottomSheet} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <BottomSheetScrollView 
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {classes.map((classType) => {
              const isSelected = selectedClass?.name === classType.name;
              return (
                <TouchableOpacity
                  key={classType.name}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleClassSelect(classType)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {classType.name}
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
    paddingBottom: 120,
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
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  selectButton: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
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
  submitButtonGradient: {
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
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
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
  optionsContent: {
    paddingHorizontal: 24,
    paddingBottom: 88,
    flexGrow: 1,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  optionTextSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});
