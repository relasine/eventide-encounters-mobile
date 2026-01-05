import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { Forsaken } from '../../components/content/Forsaken';
import { Behemoth } from '../../components/content/Behemoth';
import { Peril } from '../../components/content/Peril';
import { Event } from '../../components/content/Event';
import { BehemothDungeon, GeneratedDungeon, EnemyDungeon, EventDungeon, PerilDungeon } from '@/constants/types';
import { Horde } from '../../components/content/Horde';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const { region } = useRegion();
  const [encounter, setEncounter] = useState<GeneratedDungeon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const colors = Colors.dark;

  const generateDungeon = async () => {
    setIsLoading(true);
    setEncounter(null);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/dungeon/${region}`);
      const data = await response.json();
      setEncounter(data);
    } catch (error) {
      console.error(error);
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RegionSelector />
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Generating dungeon...</Text>
            </View>
          ) : encounter ? (
            <View style={styles.encounterCard}>
              <Image
                source={encounter.image}
                style={styles.encounterImage}
                contentFit="cover"
              />
              
              <View style={styles.encounterInfo}>
                <Text style={styles.rollText}>Roll: {encounter.dungeonNumber}</Text>
                <Text style={styles.encounterTypeText}>{encounter.roomType}</Text>
                {encounter.roomSubtype && (
                  <Text style={styles.subtypeText}>{encounter.roomSubtype}</Text>
                )}
              </View>

              <View style={styles.encounterDetails}>
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
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Generate Your Dungeon</Text>
              <Text style={styles.emptyStateText}>
                Tap the button below to create a new encounter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <LinearGradient
          colors={colors.accentGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateDungeon}
            activeOpacity={0.9}
          >
            <Text style={styles.generateButtonText}>Generate Dungeon</Text>
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
  header: {
    marginBottom: 24,
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
  encounterImage: {
    width: '100%',
    aspectRatio: 400 / 250, // 1.6:1 ratio (400x250)
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  encounterInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  buttonGradient: {
    borderRadius: 14,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  generateButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
});
