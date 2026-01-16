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
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Character, GuildPerk } from '@/constants/types';

type GuildType = "fighter's" | "hunter's" | "mage's" | "merchant's";

const GUILD_OPTIONS: { label: string; value: GuildType }[] = [
  { label: "Fighter's Guild", value: "fighter's" },
  { label: "Hunter's Guild", value: "hunter's" },
  { label: "Mage's Guild", value: "mage's" },
  { label: "Merchant's Guild", value: "merchant's" },
];

export default function AddGuildPerkScreen() {
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

  const [selectedGuild, setSelectedGuild] = useState<GuildType | null>(null);
  const [guildPerk, setGuildPerk] = useState<string>('');

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

  const handleSubmit = async () => {
    if (!character || !selectedGuild || !guildPerk.trim()) {
      setError('Both guild selection and guild perk are required');
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

      const newGuildPerk: GuildPerk = {
        guild: selectedGuild,
        perk: guildPerk.trim(),
      };

      charactersArray[characterIndex].guildPerk = newGuildPerk;

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      setCharacter(charactersArray[characterIndex]);
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding guild perk:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !selectedGuild || !guildPerk.trim() || isSubmitting;

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
        <Text style={styles.title}>Add Guild Perk</Text>
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
            {/* Guild Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Guild *</Text>
              <View style={styles.radioGroup}>
                {GUILD_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioOption,
                      selectedGuild === option.value &&
                        styles.radioOptionSelected,
                    ]}
                    onPress={() => setSelectedGuild(option.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        selectedGuild === option.value &&
                          styles.radioButtonSelectedContainer,
                      ]}
                    >
                      {selectedGuild === option.value && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.radioLabel,
                        selectedGuild === option.value &&
                          styles.radioLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Guild Perk Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Guild Perk *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={guildPerk}
                onChangeText={setGuildPerk}
                placeholder="Enter guild perk"
                placeholderTextColor={Colors.dark.textTertiary}
                multiline
                numberOfLines={6}
              />
            </View>

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
                <Text style={styles.submitButtonText}>Add Guild Perk</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  radioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelectedContainer: {
    borderColor: Colors.dark.accent,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  radioLabelSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
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
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
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
});
