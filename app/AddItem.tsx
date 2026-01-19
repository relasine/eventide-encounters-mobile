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
import { Character, BackpackItem, LuniteShard } from '@/constants/types';

type ItemType = 'Item' | 'Lunite Shard';
type StackingType = 'non-stacking' | 'stacking' | 'stacking x2';

export default function AddItemScreen() {
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

  // Item type selection
  const [itemType, setItemType] = useState<ItemType>('Item');

  // Item form fields
  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [isStackable, setIsStackable] = useState<boolean>(false);

  // Lunite Shard form fields
  const [shardName, setShardName] = useState<string>('');
  const [shardDescription, setShardDescription] = useState<string>('');
  const [stacking, setStacking] = useState<StackingType | null>(null);

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

  const handleItemSubmit = async () => {
    if (!character || !itemName.trim() || !itemDescription.trim()) {
      setError('Name and Description are required');
      return;
    }

    if (character.backpack.length >= 10) {
      setError('Backpack is full (max 10 items)');
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

      const newItem: BackpackItem = {
        name: itemName.trim(),
        description: itemDescription.trim(),
        stackable: isStackable,
        qty: 1,
      };

      charactersArray[characterIndex].backpack = [
        ...charactersArray[characterIndex].backpack,
        newItem,
      ];

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShardSubmit = async () => {
    if (
      !character ||
      !shardName.trim() ||
      !shardDescription.trim() ||
      stacking === null
    ) {
      setError('Name, Description, and Stacking are required');
      return;
    }

    if (character.backpack.length >= 10) {
      setError('Backpack is full (max 10 items)');
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

      const newShard: LuniteShard = {
        name: shardName.trim(),
        action: shardDescription.trim(),
        stacking: stacking,
        isEquipped: false,
      };

      charactersArray[characterIndex].backpack = [
        ...charactersArray[characterIndex].backpack,
        newShard,
      ];

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding lunite shard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isItemSubmitDisabled =
    !itemName.trim() || !itemDescription.trim() || isSubmitting;
  const isShardSubmitDisabled =
    !shardName.trim() ||
    !shardDescription.trim() ||
    stacking === null ||
    isSubmitting;

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
        <Text style={styles.title}>Add Item</Text>
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
            {/* Item Type Selection */}
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  itemType === 'Item' && styles.radioOptionSelected,
                ]}
                onPress={() => setItemType('Item')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioButton,
                    itemType === 'Item' && styles.radioButtonSelectedContainer,
                  ]}
                >
                  {itemType === 'Item' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    itemType === 'Item' && styles.radioLabelSelected,
                  ]}
                >
                  Item
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  itemType === 'Lunite Shard' && styles.radioOptionSelected,
                ]}
                onPress={() => setItemType('Lunite Shard')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioButton,
                    itemType === 'Lunite Shard' &&
                      styles.radioButtonSelectedContainer,
                  ]}
                >
                  {itemType === 'Lunite Shard' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    itemType === 'Lunite Shard' && styles.radioLabelSelected,
                  ]}
                >
                  Lunite Shard
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {itemType === 'Item' ? (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="Enter item name"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={itemDescription}
                    onChangeText={setItemDescription}
                    placeholder="Enter item description"
                    placeholderTextColor={Colors.dark.textTertiary}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setIsStackable(!isStackable)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isStackable && styles.checkboxBoxChecked,
                    ]}
                  >
                    {isStackable && (
                      <IconSymbol
                        name="checkmark"
                        size={16}
                        color={Colors.dark.text}
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Stackable</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isItemSubmitDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={handleItemSubmit}
                  disabled={isItemSubmitDisabled}
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Item</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={shardName}
                    onChangeText={setShardName}
                    placeholder="Enter shard name"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={shardDescription}
                    onChangeText={setShardDescription}
                    placeholder="Enter shard description"
                    placeholderTextColor={Colors.dark.textTertiary}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Stacking *</Text>
                  <View style={styles.stackingRadioGroup}>
                    {(
                      [
                        'non-stacking',
                        'stacking',
                        'stacking x2',
                      ] as StackingType[]
                    ).map(option => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.stackingRadioOption,
                          stacking === option &&
                            styles.stackingRadioOptionSelected,
                        ]}
                        onPress={() => setStacking(option)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioButton,
                            stacking === option &&
                              styles.radioButtonSelectedContainer,
                          ]}
                        >
                          {stacking === option && (
                            <View style={styles.radioButtonSelected} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.radioLabel,
                            stacking === option && styles.radioLabelSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isShardSubmitDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={handleShardSubmit}
                  disabled={isShardSubmitDisabled}
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Add Lunite Shard
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
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
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  stackingRadioGroup: {
    gap: 12,
  },
  stackingRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  stackingRadioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
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
