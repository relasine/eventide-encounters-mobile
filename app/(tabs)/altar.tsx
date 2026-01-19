import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { Behemoth } from '../../components/content/Behemoth';
import { Peril } from '../../components/content/Peril';
import { Horde } from '../../components/content/Horde';
import { MasterBehemoth } from '@/components/content/MasterBehemoth';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { DefendRoll } from '@/components/DefendRoll';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { API_KEY, API_URL } from '@/constants';
import { useResponsive } from '@/hooks/use-responsive';

export default function AltarScreen() {
  const { region } = useRegion();
  const [altarResponse, setAltarResponse] = useState<any | null>(null);
  const [rollModifier, setRollModifier] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = Colors.dark;
  const { isTablet } = useResponsive();

  const generateAltarResponse = async () => {
    setIsLoading(true);
    setAltarResponse(null);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/api/v1/altar/${region}/${rollModifier}`,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch altar response: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data || !data.altarResult) {
        throw new Error('Invalid response format from server');
      }

      setAltarResponse(data.altarResult);
      setRollModifier(rollModifier + 1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating altar response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBehemoth = async () => {
    setIsLoading(true);
    setAltarResponse(null);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/v1/behemoth/${region}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch behemoth: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data || !data.altarResult) {
        throw new Error('Invalid response format from server');
      }

      setAltarResponse(data.altarResult);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating behemoth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decrementRollModifier = () => {
    if (rollModifier > 0) {
      setRollModifier(rollModifier - 1);
    }
  };

  const incrementRollModifier = () => {
    setRollModifier(rollModifier + 1);
  };

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
            <View style={styles.headerLeft}>
              <View style={styles.regionButtonWrapper}>
                <RegionSelector />
              </View>
              <View style={styles.modifierContainer}>
                <Text style={styles.modifierLabel}>Modifier</Text>
                <View style={styles.modifierControls}>
                  <TouchableOpacity
                    disabled={rollModifier <= 0}
                    style={[
                      styles.modifierButton,
                      rollModifier <= 0 && styles.modifierButtonDisabled,
                    ]}
                    onPress={decrementRollModifier}
                    onLongPress={() => setRollModifier(0)}
                  >
                    <Text
                      style={[
                        styles.modifierButtonText,
                        rollModifier <= 0 && styles.modifierButtonTextDisabled,
                      ]}
                    >
                      −
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.modifierValue}>
                    <Text style={styles.modifierValueText}>{rollModifier}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modifierButton}
                    onPress={incrementRollModifier}
                  >
                    <Text style={styles.modifierButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.rollButtonWrapper,
                !isTablet && styles.rollButtonWrapperMobile,
              ]}
            >
              {isTablet && <DefendRoll />}
              <RollSelector />
            </View>
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Rolling altar...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={generateAltarResponse}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : altarResponse ? (
            <View style={styles.responseContainer}>
              {altarResponse.result !== 'Master Behemoth' && (
                <View style={styles.responseCard}>
                  <Text style={styles.responseLabel}>Altar Response</Text>
                  <Text style={styles.responseResult}>
                    {altarResponse.result}
                  </Text>
                  <Text style={styles.responseAction}>
                    {altarResponse.altarAction}
                  </Text>
                </View>
              )}

              {altarResponse.result === 'Ambush' && altarResponse.ambush && (
                <View style={styles.encounterSection}>
                  <Text style={styles.sectionTitle}>Ambush Result</Text>
                  <Horde encounter={altarResponse.ambush} isAltar />
                </View>
              )}

              {altarResponse.result === 'Behemoth' &&
                altarResponse.behemoth && (
                  <View style={styles.encounterSection}>
                    <Text style={styles.sectionTitle}>Behemoth Result</Text>
                    <Behemoth encounter={altarResponse.behemoth} isAltar />
                  </View>
                )}

              {altarResponse.result === 'Peril' && altarResponse.peril && (
                <View style={styles.encounterSection}>
                  <Text style={styles.sectionTitle}>Peril Result</Text>
                  <Peril encounter={altarResponse.peril} />
                </View>
              )}

              {altarResponse.result === 'Master Behemoth' &&
                altarResponse.masterBehemoth && (
                  <MasterBehemoth
                    encounter={altarResponse.masterBehemoth}
                    generateBehemoth={generateBehemoth}
                  />
                )}

              {altarResponse.reward && (
                <View style={styles.rewardCard}>
                  <Text style={styles.rewardLabel}>Reward</Text>
                  <Text style={styles.rewardValue}>{altarResponse.reward}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Roll the Altar</Text>
              <Text style={styles.emptyStateText}>
                Use the button below to generate an altar response
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, isTablet && styles.footerTablet]}>
        <View style={styles.buttonRow}>
          <LinearGradient
            colors={colors.accentGradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isLoading && styles.primaryButtonDisabled,
              ]}
              onPress={generateAltarResponse}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Roll Altar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  regionButtonWrapper: {
    marginBottom: -16,
  },
  rollButtonWrapper: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: -16,
  },
  rollButtonWrapperMobile: {
    flexDirection: 'column',
  },
  modifierContainer: {
    alignItems: 'flex-start',
  },
  modifierLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.dark.textTertiary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modifierControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modifierButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  modifierButtonDisabled: {
    backgroundColor: Colors.dark.backgroundTertiary,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  modifierButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    lineHeight: 18,
  },
  modifierButtonTextDisabled: {
    color: Colors.dark.textTertiary,
  },
  modifierValue: {
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifierValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 24,
  },
  responseContainer: {
    width: '100%',
    gap: 20,
  },
  responseCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    marginBottom: 20,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  responseResult: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.accent,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  responseAction: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  encounterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    marginTop: 20,
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardValue: {
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 14,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  secondaryButtonDisabled: {
    borderColor: Colors.dark.border,
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  secondaryButtonTextDisabled: {
    color: Colors.dark.textTertiary,
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
});
