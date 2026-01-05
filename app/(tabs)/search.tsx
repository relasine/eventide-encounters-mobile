import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { Colors } from '@/constants/theme';

export default function SearchScreen() {
    const { region } = useRegion();
    const [searchResults, setSearchResults] = useState<any | null>(null);
    const colors = Colors.dark;

    const search = async () => {
        setSearchResults(null);

        try {
            const response = await fetch(`http://localhost:3001/api/v1/search/${region}`);
            const data = await response.json();
            setSearchResults(data.search);
        } catch (error) {
            console.error(error);
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
                    <Text style={styles.title}>Search</Text>
                </View>

                {searchResults ? (
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
            </ScrollView>

            <View style={styles.footer}>
                <LinearGradient
                    colors={colors.accentGradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <TouchableOpacity 
                        style={styles.searchButton} 
                        onPress={search}
                        activeOpacity={0.9}
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
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
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
});