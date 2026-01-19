import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Character, Title } from '@/constants/types';

type TitleSource =
  | 'Universal'
  | 'Sundessa'
  | 'Mantora'
  | 'Torgul'
  | 'Ridian'
  | 'Jakkar'
  | 'Olma'
  | "Fighter's Guild"
  | "Hunter's Guild"
  | "Mage's Guild"
  | "Merchant's Guild";

const SOURCE_OPTIONS: TitleSource[] = [
  'Universal',
  'Sundessa',
  'Mantora',
  'Torgul',
  'Ridian',
  'Jakkar',
  'Olma',
  "Fighter's Guild",
  "Hunter's Guild",
  "Mage's Guild",
  "Merchant's Guild",
];

export default function AddTitleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = Colors.dark;

  const characterId: string | null =
    params.characterId !== undefined && params.characterId !== null
      ? (params.characterId as string)
      : null;

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSource, setSelectedSource] = useState<TitleSource | null>(null);
  const [titleName, setTitleName] = useState<string>('');

  const sourceBottomSheetRef = useRef<BottomSheet>(null);
  const sourceSnapPoints = useMemo(() => ['90%'], []);

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

  const openSourceBottomSheet = useCallback(() => {
    sourceBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSourceBottomSheet = useCallback(() => {
    sourceBottomSheetRef.current?.close();
  }, []);

  const handleSourceSelect = useCallback(
    (source: TitleSource) => {
      setSelectedSource(source);
      closeSourceBottomSheet();
    },
    [closeSourceBottomSheet]
  );

  const renderSourceBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeSourceBottomSheet}
      />
    ),
    [closeSourceBottomSheet]
  );

  const handleSubmit = async () => {
    if (!character || !selectedSource || !titleName.trim()) {
      setError('Both source and title name are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const charactersJson = await AsyncStorage.getItem('characters');
      if (!charactersJson) {
        throw new Error('Characters not found in storage');
      }

      const charactersArray: Character[] = JSON.parse(charactersJson);
      const characterIndex = charactersArray.findIndex(
        char => char.id === characterId
      );

      if (characterIndex === -1) {
        throw new Error('Character not found');
      }

      const newTitle: Title = {
        source: selectedSource,
        titleName: titleName.trim(),
      };

      // Initialize titles array if it doesn't exist
      if (!charactersArray[characterIndex].titles) {
        charactersArray[characterIndex].titles = [];
      }

      charactersArray[characterIndex].titles = [
        ...charactersArray[characterIndex].titles,
        newTitle,
      ];

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding title:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !selectedSource || !titleName.trim() || isSubmitting;

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
          <IconSymbol name="chevron.left" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Title</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error && !character ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {/* Source Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Source *</Text>
              <TouchableOpacity
                style={styles.sourceButton}
                onPress={openSourceBottomSheet}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sourceButtonText,
                    !selectedSource && styles.sourceButtonTextPlaceholder,
                  ]}
                >
                  {selectedSource || 'Choose Source'}
                </Text>
                <IconSymbol
                  name="chevron.down"
                  size={20}
                  color={Colors.dark.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Title Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title Name *</Text>
              <TextInput
                style={styles.input}
                value={titleName}
                onChangeText={setTitleName}
                placeholder="Enter title name"
                placeholderTextColor={Colors.dark.textTertiary}
              />
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitDisabled && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              activeOpacity={0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.dark.text} />
              ) : (
                <Text style={styles.submitButtonText}>Add Title</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Source Bottom Sheet */}
      <BottomSheet
        ref={sourceBottomSheetRef}
        index={-1}
        snapPoints={sourceSnapPoints}
        enablePanDownToClose
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        backdropComponent={renderSourceBackdrop}
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
            <Text style={styles.bottomSheetHeaderText}>Choose Source</Text>
            <TouchableOpacity
              onPress={closeSourceBottomSheet}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.sourceOptionsContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {SOURCE_OPTIONS.map(source => {
              const isSelected = selectedSource === source;
              return (
                <TouchableOpacity
                  key={source}
                  style={[
                    styles.sourceOption,
                    isSelected && styles.sourceOptionSelected,
                  ]}
                  onPress={() => handleSourceSelect(source)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sourceOptionText,
                      isSelected && styles.sourceOptionTextSelected,
                    ]}
                  >
                    {source}
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  content: {
    gap: 24,
  },
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sourceButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  sourceButtonTextPlaceholder: {
    color: Colors.dark.textTertiary,
  },
  input: {
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
  },
  errorBannerText: {
    fontSize: 14,
    color: '#ef4444',
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
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
  sourceOptionsContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    flexGrow: 1,
  },
  sourceOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 12,
  },
  sourceOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  sourceOptionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  sourceOptionTextSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});
