import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { Forsaken } from '../../components/content/Forsaken';
import { Behemoth } from '../../components/content/Behemoth';
import { Peril } from '../../components/content/Peril';
import { Event } from '../../components/content/Event';
import { BehemothDungeon, GeneratedDungeon, EnemyDungeon, EventDungeon, PerilDungeon, BacktrackResult } from '@/constants/types';
import { Horde } from '../../components/content/Horde';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { RollSelector } from '@/components/RollSelector';
import { Colors } from '@/constants/theme';
import { API_KEY, API_URL } from '@/constants';
import { useResponsive } from '@/hooks/use-responsive';

export default function HomeScreen() {
  const { region } = useRegion();
  const [encounter, setEncounter] = useState<GeneratedDungeon | null>(null);
  const [backtrackResult, setBacktrackResult] = useState<BacktrackResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = Colors.dark;
  const { isTablet } = useResponsive();

  const generateDungeon = async () => {
    setIsLoading(true);
    setEncounter(null);
    setError(null);
    setBacktrackResult(null);
    try {
      const response = await fetch(`${API_URL}/api/v1/dungeon/${region}`, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate dungeon: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data) {
        throw new Error('Invalid response format from server');
      }
      
      setEncounter(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating dungeon:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const backtrack = async () => {
    setIsLoading(true);
    setEncounter(null);
    setBacktrackResult(null);
    setError(null);
    try {
        const response = await fetch(`${API_URL}/api/v1/backtrack/${region}`, {
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to backtrack: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data) {
            throw new Error('Invalid response format from server');
        }
        
        setBacktrackResult(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error backtracking:', error);
    } finally {
        setIsLoading(false);
    }
}
  
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Generating dungeon...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={generateDungeon}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : encounter ? (
            <View style={[
              styles.encounterCard,
              isTablet && styles.encounterCardTablet
            ]}>
              <View style={[
                styles.cardContent,
                isTablet && styles.cardContentTablet
              ]}>
                <View style={[
                  styles.imageContainer,
                  isTablet && styles.imageContainerTablet
                ]}>
                  <Image
                    source={encounter.image}
                    style={[
                      styles.encounterImage,
                      isTablet && styles.encounterImageTablet
                    ]}
                    contentFit="cover"
                  />
                </View>
                
                <View style={[
                  styles.encounterInfo,
                  isTablet && styles.encounterInfoTablet
                ]}>
                   {encounter.roomType === 'Combat' &&
                    (encounter.roomSubtype === 'Behemoth' && 'enemy' in encounter
                      ? <Text style={styles.name}>{(encounter as BehemothDungeon).enemy.name}</Text>
                      : (encounter.roomSubtype === 'Forsaken' || encounter.roomSubtype === 'Ambush') && 'enemy' in encounter
                        ? <Text style={styles.name}>{(encounter as EnemyDungeon).enemy.name}</Text>
                        : null)
                  }
                  <Text style={styles.rollText}>Roll: {encounter.dungeonNumber}</Text>
                  <Text style={styles.encounterTypeText}>{encounter.roomType}</Text>
                  {encounter.roomSubtype && (
                    <Text style={styles.subtypeText}>{encounter.roomSubtype}</Text>
                  )}
                  {/* 
                    Show the enemy/behemoth/forsaken name for Combat rooms in a type-safe way
                  */}
                </View>
              </View>

              <View style={[
                styles.encounterDetails,
                isTablet && styles.encounterDetailsTablet
              ]}>
                {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Behemoth' ? (
                  <Behemoth encounter={(encounter as BehemothDungeon).enemy} />
                ) : null}
                {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Forsaken' ? (
                  <Forsaken encounter={(encounter as EnemyDungeon).enemy} />
                ) : null}
                {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Ambush' ? (
                  <Horde encounter={(encounter as EnemyDungeon).enemy} />
                ) : null}
                {encounter.roomType === 'Event' && 'event' in encounter && (encounter as EventDungeon).event?.action ? (
                  <Event encounter={(encounter as EventDungeon).event} />
                ) : null}
                {encounter.roomType === 'Peril & Altar' && encounter.roomSubtype === null ? (
                  <Peril encounter={(encounter as PerilDungeon).peril} />
                ) : null}
              </View>
            </View>
          ) : backtrackResult ? (
            <View style={styles.resultCard}>
              {backtrackResult.ambushResult === null && !backtrackResult.ambushed ? (
                <View style={styles.safeMessageContainer}>
                  <Text style={styles.safeMessage}>
                    You backtrack safely without attracting unwanted attention.
                  </Text>
                </View>
              ) : null}
              {backtrackResult.ambushResult !== null && backtrackResult.ambushed ? (
                <View>
                    <Text style={styles.ambushTitle}>You have been ambushed!</Text>
                    <Text style={styles.ambushDescription}>You are preemptively attacked by four enemies from the horde!</Text>
                    <Text style={styles.ambushName}>{backtrackResult.ambushResult.name}</Text>
                    <Horde encounter={backtrackResult.ambushResult} />
                </View>
            ) : null}
        </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Generate Your Dungeon</Text>
              <Text style={styles.emptyStateText}>
                Tap the button below to create a new encounter
              </Text>
            </View>
          )}
          </View>
        </View>
      </ScrollView>

      <View style={[
        styles.footer,
        isTablet && styles.footerTablet
      ]}>
        <View style={styles.buttonContainer}>
          <View style={styles.exploreButtonContainer}>
            <LinearGradient
              colors={colors.accentGradient as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <TouchableOpacity 
                style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
                onPress={generateDungeon}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <Text style={styles.generateButtonText}>Explore</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={styles.backtrackButtonContainer}>
            <TouchableOpacity 
              style={[styles.backtrackButton, isLoading && styles.generateButtonDisabled]}
              onPress={backtrack}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <Text style={styles.backtrackButtonText}>Backtrack</Text>
            </TouchableOpacity>
          </View>
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
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    paddingBottom: 8
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
  encounterCard: {
    backgroundColor: 'rgba(21, 21, 32, 0.6)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  encounterCardTablet: {
    overflow: 'visible',
  },
  cardContent: {
    width: '100%',
  },
  cardContentTablet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
  },
  imageContainer: {
    width: '100%',
  },
  imageContainerTablet: {
    width: '44%',
    flexShrink: 0,
    paddingTop: 0,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
  },
  encounterImage: {
    width: '100%',
    aspectRatio: 400 / 250, // 1.6:1 ratio (400x250)
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  encounterImageTablet: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  encounterInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  encounterInfoTablet: {
    flex: 1,
    padding: 0,
    borderBottomWidth: 0,
    paddingTop: 0,
  },
  rollText: {
    fontSize: 14,
    color: Colors.dark.textTertiary,
    marginBottom: 8,
    fontWeight: '400',
  },
  encounterTypeText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtypeText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontWeight: '400',
  },
  encounterDetails: {
    padding: 20,
  },
  encounterDetailsTablet: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  exploreButtonContainer: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  generateButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  backtrackButtonContainer: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  backtrackButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.dark.borderSecondary,
  },
  backtrackButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.5,
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
  generateButtonDisabled: {
    opacity: 0.6,
  },
  resultCard: {
    backgroundColor: 'rgba(21, 21, 32, 0.6)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    width: '100%',
  },
  ambushTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  ambushDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  ambushName: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.dark.accent,
    textAlign: 'center',
    marginBottom: 16,
  },
  safeMessageContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeMessage: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.dark.text,
      textAlign: 'center',
      lineHeight: 28,
  },
});
