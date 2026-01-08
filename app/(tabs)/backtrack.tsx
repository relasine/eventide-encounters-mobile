import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { Colors } from '@/constants/theme';
import { API_KEY, API_URL } from '@/constants';
import { useResponsive } from '@/hooks/use-responsive';
import { BacktrackResult } from '@/constants/types';
import { Horde } from '@/components/content/Horde';

export default function BacktrackScreen() {
    const { region } = useRegion();
    const [backtrackResult, setBacktrackResult] = useState<BacktrackResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const colors = Colors.dark;
    const { isTablet } = useResponsive();

    const backtrack = async () => {
        setIsLoading(true);
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
                        <Text style={styles.title}>Backtrack</Text>
                    </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.loadingText}>Backtracking...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={backtrack}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
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
                        <Text style={styles.emptyStateTitle}>Backtrack</Text>
                        <Text style={styles.emptyStateText}>
                            Use the button below to backtrack through your region
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
                        style={[styles.backtrackButton, isLoading && styles.backtrackButtonDisabled]} 
                        onPress={backtrack}
                        activeOpacity={0.9}
                        disabled={isLoading}
                    >
                        <Text style={styles.backtrackButtonText}>Backtrack</Text>
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
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.text,
        marginTop: 12,
        marginBottom: 8,
    },
    resultCard: {
        backgroundColor: 'rgba(21, 21, 32, 0.6)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        width: '100%',
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
    backtrackButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    backtrackButtonText: {
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
    backtrackButtonDisabled: {
        opacity: 0.6,
    },
});

