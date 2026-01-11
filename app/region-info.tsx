import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Behemoth, Enemy, MasterBehemoth } from '@/constants/types';
import { API_KEY, API_URL } from '@/constants';

type BestiaryResponse = {
    bestiary: {
        forsaken: Enemy[]
        behemoth: Behemoth[]
        horde: Enemy[]
        masterBehemoth: MasterBehemoth
    }
}

const formatRegionName = (region: string): string => {
  return region.charAt(0).toUpperCase() + region.slice(1);
};

export default function RegionInfoScreen() {
  const router = useRouter();
  const { region } = useRegion();
  const colors = Colors.dark;
  const regionDisplayName = formatRegionName(region);
  const [bestiaryResponse, setBestiaryResponse] = useState<BestiaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestiary = async () => {
      setIsLoading(true);
      setBestiaryResponse(null);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/v1/bestiary/${region}`, {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bestiary: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('Invalid response format from server');
        }
        
        setBestiaryResponse(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error fetching bestiary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestiary();
  }, [region]);

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
        <Text style={styles.title}>{regionDisplayName} Region Info</Text>
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
              <Text style={styles.loadingText}>Loading bestiary...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : bestiaryResponse ? (
            <View style={styles.bestiaryContainer}>
              <Text style={styles.bestiaryTitle}>{regionDisplayName} Bestiary</Text>
              {/* Forsaken Section */}
              {bestiaryResponse.bestiary.forsaken.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Forsaken</Text>
                  {bestiaryResponse.bestiary.forsaken.map((enemy, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.item}
                      onPress={() => router.push({
                        pathname: '/bestiary-entry',
                        params: { name: enemy.name, type: 'forsaken' }
                      })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.itemName}>{enemy.name}</Text>
                      <Text style={styles.itemLevel}>Level {enemy.level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Horde Section */}
              {bestiaryResponse.bestiary.horde.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Horde</Text>
                  {bestiaryResponse.bestiary.horde.map((enemy, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.item}
                      onPress={() => router.push({
                        pathname: '/bestiary-entry',
                        params: { name: enemy.name, type: 'horde' }
                      })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.itemName}>{enemy.name}</Text>
                      <Text style={styles.itemLevel}>Level {enemy.level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Behemoth Section */}
              {bestiaryResponse.bestiary.behemoth.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Behemoth</Text>
                  {bestiaryResponse.bestiary.behemoth.map((behemoth, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.item}
                      onPress={() => router.push({
                        pathname: '/bestiary-entry',
                        params: { name: behemoth.name, type: 'behemoth' }
                      })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.itemName}>{behemoth.name}</Text>
                      <Text style={styles.itemLevel}>Level {behemoth.level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Master Behemoth Section */}
              {bestiaryResponse.bestiary.masterBehemoth && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Master Behemoth</Text>
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => router.push({
                      pathname: '/bestiary-entry',
                      params: { name: bestiaryResponse.bestiary.masterBehemoth.name, type: 'master-behemoth' }
                    })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.itemName}>{bestiaryResponse.bestiary.masterBehemoth.name}</Text>
                    <Text style={styles.itemLevel}>Level {bestiaryResponse.bestiary.masterBehemoth.level}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
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
  bestiaryContainer: {
    width: '100%',
    gap: 24,
  },
  bestiaryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
  },
  itemLevel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
});

