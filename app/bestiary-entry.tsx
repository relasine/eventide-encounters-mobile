import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Behemoth, Enemy, MasterBehemoth } from '@/constants/types';
import { API_KEY, API_URL } from '@/constants';
import { Forsaken } from '@/components/content/Forsaken';
import { Horde } from '@/components/content/Horde';
import { Behemoth as BehemothComponent } from '@/components/content/Behemoth';
import { MasterBehemoth as MasterBehemothComponent } from '@/components/content/MasterBehemoth';

export default function BestiaryEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { region } = useRegion();
  const colors = Colors.dark;
  const name = params.name as string;
  const type = params.type as string;
  
  const [entryData, setEntryData] = useState<Enemy | Behemoth | MasterBehemoth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!name || !type) return;
      
      setIsLoading(true);
      setEntryData(null);
      setError(null);
      try {
        // Replace spaces with %20 for URL encoding
        const encodedName = name.replace(/\s/g, '%20');
        const response = await fetch(`${API_URL}/api/v1/bestiary/${region}/${encodedName}`, {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch entry: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('Invalid response format from server');
        }
        
        setEntryData(data.bestiaryEntry);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error fetching bestiary entry:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [name, type, region]);

  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'forsaken':
        return 'Forsaken';
      case 'horde':
        return 'Horde';
      case 'behemoth':
        return 'Behemoth';
      case 'master-behemoth':
        return 'Master Behemoth';
      default:
        return '';
    }
  };

  const renderEntry = () => {
    if (!entryData) return null;

    switch (type) {
      case 'forsaken':
        return <Forsaken encounter={entryData as Enemy} />;
      case 'horde':
        return <Horde encounter={entryData as Enemy} />;
      case 'behemoth':
        return <BehemothComponent encounter={entryData as Behemoth} />;
      case 'master-behemoth':
        return <MasterBehemothComponent 
          encounter={entryData as MasterBehemoth} 
          generateBehemoth={() => {}} 
          isBestiaryEntry={true}
        />;
      default:
        return null;
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
        <Text style={styles.title}>{name || 'Entry'}</Text>
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
              <Text style={styles.loadingText}>Loading entry...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : entryData ? (
            <>
              <Text style={styles.subtitle}>{getTypeDisplayName(type)}</Text>
              {renderEntry()}
            </>
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
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
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
});

