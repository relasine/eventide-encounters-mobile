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
import { Character, Weapon, Shield } from '@/constants/types';

type ItemTypeSelection = 'Weapon' | 'Shield';

export default function AddWeaponOrShieldScreen() {
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
  const [itemType, setItemType] = useState<ItemTypeSelection>('Weapon');

  // Weapon form fields
  const [weaponName, setWeaponName] = useState<string>('');
  const [weaponHanded, setWeaponHanded] = useState<1 | 2>(1);
  const [weaponType, setWeaponType] = useState<'melee' | 'ranged' | 'arcane'>(
    'melee'
  );
  const [weaponCharges, setWeaponCharges] = useState<number>(0);
  const [weaponAbilityName, setWeaponAbilityName] = useState<string>('');
  const [weaponAbility, setWeaponAbility] = useState<string>('');
  const [weaponActionType, setWeaponActionType] = useState<
    'free action' | 'primary action' | null
  >(null);

  // Shield form fields
  const [shieldName, setShieldName] = useState<string>('');
  const [shieldAbility, setShieldAbility] = useState<string>('');

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

  const handleWeaponSubmit = async () => {
    if (!character || !weaponName.trim()) {
      setError('Name is required');
      return;
    }

    if ((character.weaponsAndShield?.length ?? 0) >= 4) {
      setError('Maximum of 4 weapons or shields allowed');
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

      const newWeapon: Weapon = {
        name: weaponName.trim(),
        handed: weaponHanded,
        type: weaponType,
        maxCharges:
          weaponCharges === 0 ? null : (weaponCharges as 1 | 2 | 3 | 4 | 5),
        currentCharge:
          weaponCharges === 0 ? null : (weaponCharges as 1 | 2 | 3 | 4 | 5),
        abilityName: weaponAbilityName.trim() || null,
        ability: weaponAbility.trim() || null,
        actionType: weaponActionType === null ? null : weaponActionType,
        equipped: false,
      };

      const currentWeapons =
        charactersArray[characterIndex].weaponsAndShield || [];
      charactersArray[characterIndex].weaponsAndShield = [
        ...currentWeapons,
        newWeapon,
      ] as any;

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      setCharacter(charactersArray[characterIndex]);
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding weapon:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShieldSubmit = async () => {
    if (!character || !shieldName.trim()) {
      setError('Name is required');
      return;
    }

    if ((character.weaponsAndShield?.length ?? 0) >= 4) {
      setError('Maximum of 4 weapons or shields allowed');
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

      const newShield: Shield = {
        name: shieldName.trim(),
        ability: shieldAbility.trim() || null,
        equipped: false,
      };

      const currentWeapons =
        charactersArray[characterIndex].weaponsAndShield || [];
      charactersArray[characterIndex].weaponsAndShield = [
        ...currentWeapons,
        newShield,
      ] as any;

      await AsyncStorage.setItem('characters', JSON.stringify(charactersArray));
      setCharacter(charactersArray[characterIndex]);
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error adding shield:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrementCharges = () => {
    if (weaponCharges < 5) {
      setWeaponCharges(weaponCharges + 1);
    }
  };

  const handleDecrementCharges = () => {
    if (weaponCharges > 0) {
      setWeaponCharges(weaponCharges - 1);
    }
  };

  const isWeaponSubmitDisabled = !weaponName.trim() || isSubmitting;
  const isShieldSubmitDisabled = !shieldName.trim() || isSubmitting;

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
        <Text style={styles.title}>Add Weapon or Shield</Text>
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
                  itemType === 'Weapon' && styles.radioOptionSelected,
                ]}
                onPress={() => setItemType('Weapon')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioButton,
                    itemType === 'Weapon' &&
                      styles.radioButtonSelectedContainer,
                  ]}
                >
                  {itemType === 'Weapon' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    itemType === 'Weapon' && styles.radioLabelSelected,
                  ]}
                >
                  Weapon
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  itemType === 'Shield' && styles.radioOptionSelected,
                ]}
                onPress={() => setItemType('Shield')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioButton,
                    itemType === 'Shield' &&
                      styles.radioButtonSelectedContainer,
                  ]}
                >
                  {itemType === 'Shield' && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    itemType === 'Shield' && styles.radioLabelSelected,
                  ]}
                >
                  Shield
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {itemType === 'Weapon' ? (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={weaponName}
                    onChangeText={setWeaponName}
                    placeholder="Enter weapon name"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Handed *</Text>
                  <View style={styles.handedRadioGroup}>
                    <TouchableOpacity
                      style={[
                        styles.handedRadioOption,
                        weaponHanded === 1 && styles.handedRadioOptionSelected,
                      ]}
                      onPress={() => setWeaponHanded(1)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          weaponHanded === 1 &&
                            styles.radioButtonSelectedContainer,
                        ]}
                      >
                        {weaponHanded === 1 && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.radioLabel,
                          weaponHanded === 1 && styles.radioLabelSelected,
                        ]}
                      >
                        One-Handed
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.handedRadioOption,
                        weaponHanded === 2 && styles.handedRadioOptionSelected,
                      ]}
                      onPress={() => setWeaponHanded(2)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          weaponHanded === 2 &&
                            styles.radioButtonSelectedContainer,
                        ]}
                      >
                        {weaponHanded === 2 && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.radioLabel,
                          weaponHanded === 2 && styles.radioLabelSelected,
                        ]}
                      >
                        Two-Handed
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weapon Type *</Text>
                  <View style={styles.typeRadioGroup}>
                    {(['melee', 'ranged', 'arcane'] as const).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeRadioOption,
                          weaponType === type && styles.typeRadioOptionSelected,
                        ]}
                        onPress={() => setWeaponType(type)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.radioButton,
                            weaponType === type &&
                              styles.radioButtonSelectedContainer,
                          ]}
                        >
                          {weaponType === type && (
                            <View style={styles.radioButtonSelected} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.radioLabel,
                            weaponType === type && styles.radioLabelSelected,
                          ]}
                        >
                          {type === 'melee'
                            ? 'Melee'
                            : type === 'ranged'
                              ? 'Ranged'
                              : 'Arcane'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weapon Charges</Text>
                  <View style={styles.chargesContainer}>
                    <TouchableOpacity
                      style={styles.chargesButton}
                      onPress={handleDecrementCharges}
                      disabled={weaponCharges === 0}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="minus"
                        size={20}
                        color={
                          weaponCharges === 0
                            ? Colors.dark.textTertiary
                            : Colors.dark.text
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.chargesValue}>{weaponCharges}</Text>
                    <TouchableOpacity
                      style={styles.chargesButton}
                      onPress={handleIncrementCharges}
                      disabled={weaponCharges === 5}
                      activeOpacity={0.7}
                    >
                      <IconSymbol
                        name="plus"
                        size={20}
                        color={
                          weaponCharges === 5
                            ? Colors.dark.textTertiary
                            : Colors.dark.text
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weapon Skill Name</Text>
                  <TextInput
                    style={styles.input}
                    value={weaponAbilityName}
                    onChangeText={setWeaponAbilityName}
                    placeholder="Enter weapon skill name"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weapon Skill</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={weaponAbility}
                    onChangeText={setWeaponAbility}
                    placeholder="Enter weapon skill"
                    placeholderTextColor={Colors.dark.textTertiary}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Action Type *</Text>
                  <View style={styles.actionTypeRadioGroup}>
                    <TouchableOpacity
                      style={[
                        styles.actionTypeRadioOption,
                        weaponActionType === null &&
                          styles.actionTypeRadioOptionSelected,
                      ]}
                      onPress={() => setWeaponActionType(null)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          weaponActionType === null &&
                            styles.radioButtonSelectedContainer,
                        ]}
                      >
                        {weaponActionType === null && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.radioLabel,
                          weaponActionType === null &&
                            styles.radioLabelSelected,
                        ]}
                      >
                        N/A
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionTypeRadioOption,
                        weaponActionType === 'free action' &&
                          styles.actionTypeRadioOptionSelected,
                      ]}
                      onPress={() => setWeaponActionType('free action')}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          weaponActionType === 'free action' &&
                            styles.radioButtonSelectedContainer,
                        ]}
                      >
                        {weaponActionType === 'free action' && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.radioLabel,
                          weaponActionType === 'free action' &&
                            styles.radioLabelSelected,
                        ]}
                      >
                        Free Action
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionTypeRadioOption,
                        weaponActionType === 'primary action' &&
                          styles.actionTypeRadioOptionSelected,
                      ]}
                      onPress={() => setWeaponActionType('primary action')}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          weaponActionType === 'primary action' &&
                            styles.radioButtonSelectedContainer,
                        ]}
                      >
                        {weaponActionType === 'primary action' && (
                          <View style={styles.radioButtonSelected} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.radioLabel,
                          weaponActionType === 'primary action' &&
                            styles.radioLabelSelected,
                        ]}
                      >
                        Primary Action
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isWeaponSubmitDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={handleWeaponSubmit}
                  disabled={isWeaponSubmitDisabled}
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Weapon</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={shieldName}
                    onChangeText={setShieldName}
                    placeholder="Enter shield name"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Skill</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={shieldAbility}
                    onChangeText={setShieldAbility}
                    placeholder="Enter shield skill"
                    placeholderTextColor={Colors.dark.textTertiary}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isShieldSubmitDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={handleShieldSubmit}
                  disabled={isShieldSubmitDisabled}
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.dark.text} />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Shield</Text>
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  handedRadioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  handedRadioOption: {
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
  handedRadioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  typeRadioGroup: {
    gap: 12,
  },
  typeRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  typeRadioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  actionTypeRadioGroup: {
    gap: 12,
  },
  actionTypeRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionTypeRadioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  chargesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chargesButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargesValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
    minWidth: 40,
    textAlign: 'center',
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
