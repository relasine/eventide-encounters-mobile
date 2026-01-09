import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { Colors } from '@/constants/theme';
import { API_KEY, API_URL } from '@/constants';
import { useResponsive } from '@/hooks/use-responsive';

export default function SearchScreen() {
    const { region } = useRegion();
    const [searchResults, setSearchResults] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const colors = Colors.dark;
    const { isTablet } = useResponsive();

    const search = async () => {
        setIsLoading(true);
        setSearchResults(null);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/v1/search/${region}`, {
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.search) {
                throw new Error('Invalid response format from server');
            }
            
            setSearchResults(data.search);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Error searching:', error);
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
                        <View style={styles.headerLeft}>
                            <RegionSelector />
                        </View>
                    </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={search}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : searchResults ? (
                    <View style={styles.resultsCard}>
                        <Text style={styles.resultLabel}>Result</Text>
                        <Text style={styles.resultName}>{searchResults.name}</Text>
                        
                        <View style={styles.actionSection}>
                            <Text style={styles.actionLabel}>Action</Text>
                            <Text style={styles.actionText}>{searchResults.action}</Text>
                        </View>

                        {searchResults?.affects && (
                            <View style={styles.affectsSection}>
                                <Text style={styles.affectsLabel}>Affected Heroes</Text>
                                <Text style={styles.affectsText}>{searchResults.affects}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>Search for Encounters</Text>
                        <Text style={styles.emptyStateText}>
                            Use the button below to search for random encounters in your region
                        </Text>
                    </View>
                )}
                </View>
            </ScrollView>

            <View style={[
                styles.footer,
                isTablet && styles.footerTablet
            ]}>
                <LinearGradient
                    colors={colors.accentGradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <TouchableOpacity 
                        style={[styles.searchButton, isLoading && styles.searchButtonDisabled]} 
                        onPress={search}
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </LinearGradient>
    )
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
        marginBottom: 24,
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.text,
        marginTop: 12,
        marginBottom: 8,
    },
    resultsCard: {
        backgroundColor: 'rgba(21, 21, 32, 0.6)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        width: '100%',
    },
    resultLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    resultName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 20,
    },
    actionSection: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginBottom: 16,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionText: {
        fontSize: 16,
        color: Colors.dark.text,
        lineHeight: 24,
    },
    affectsSection: {
        backgroundColor: Colors.dark.backgroundTertiary,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    affectsLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    affectsText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
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
    buttonGradient: {
        borderRadius: 14,
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
        maxWidth: 700,
        alignSelf: 'center',
        width: '100%',
    },
    searchButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    searchButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
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
    searchButtonDisabled: {
        opacity: 0.6,
    },
});