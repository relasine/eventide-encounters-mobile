import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';
import { Colors } from '@/constants/theme';

export default function TreasureScreen() {
    const { region } = useRegion();
    const [treasureResults, setTreasureResults] = useState<any | null>(null);
    const colors = Colors.dark;

    const search = async () => {
        setTreasureResults(null);

        try {
            const response = await fetch(`http://localhost:3001/api/v1/treasure/${region}`);
            const data = await response.json();
            setTreasureResults(data.treasure);
        } catch (error) {
            console.error(error);
        }
    }

    const isWeapon = () => {
        return treasureResults?.item?.type === 'One-Handed' || treasureResults?.item?.type === 'Two-Handed'
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
                    <Text style={styles.title}>Treasure</Text>
                </View>

                {treasureResults ? (
                    <View style={styles.treasureCard}>
                        {treasureResults.item ? (
                            <View style={styles.itemSection}>
                                <View style={styles.itemHeader}>
                                    {isWeapon() ? (
                                        <Text style={styles.itemTitle}>
                                            {`${treasureResults.item.type} ${treasureResults.item.weaponType} Weapon`}
                                        </Text>
                                    ) : (
                                        <Text style={styles.itemTitle}>{treasureResults.item.type}</Text>
                                    )}
                                </View>

                                <View style={styles.effectSection}>
                                    <Text style={styles.effectLabel}>Effect</Text>
                                    <Text style={styles.effectName}>{treasureResults.item.name}</Text>
                                    <Text style={styles.effectAction}>{treasureResults.item.action}</Text>
                                </View>

                                {treasureResults.item.actionType && (
                                    <View style={styles.propertyRow}>
                                        <Text style={styles.propertyLabel}>Action Type</Text>
                                        <Text style={styles.propertyValue}>{treasureResults.item.actionType}</Text>
                                    </View>
                                )}

                                {isWeapon() && (
                                    <View style={styles.propertyRow}>
                                        <Text style={styles.propertyLabel}>Charges</Text>
                                        <Text style={styles.propertyValue}>{treasureResults.item.charges}</Text>
                                    </View>
                                )}

                                {treasureResults.item.stacking && (
                                    <View style={styles.propertyRow}>
                                        <Text style={styles.propertyLabel}>Stacking</Text>
                                        <Text style={styles.propertyValue}>{treasureResults.item.stacking}</Text>
                                    </View>
                                )}
                            </View>
                        ) : null}

                        {treasureResults.glowstone ? (
                            <View style={styles.glowstoneSection}>
                                <Text style={styles.glowstoneLabel}>Glowstone</Text>
                                <Text style={styles.glowstoneValue}>{treasureResults.glowstone}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateTitle}>Discover Treasure</Text>
                        <Text style={styles.emptyStateText}>
                            Use the button below to discover treasure in your region
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
                        style={styles.treasureButton} 
                        onPress={search}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.treasureButtonText}>Discover Treasure</Text>
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
    treasureCard: {
        backgroundColor: 'rgba(21, 21, 32, 0.6)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        width: '100%',
    },
    itemSection: {
        marginBottom: 20,
    },
    itemHeader: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    itemTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        textAlign: 'center',
    },
    effectSection: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginBottom: 16,
    },
    effectLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    effectName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.accent,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    effectAction: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    propertyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.dark.backgroundTertiary,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    propertyLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    propertyValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    glowstoneSection: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginTop: 20,
    },
    glowstoneLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    glowstoneValue: {
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
    treasureButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    treasureButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        letterSpacing: 0.5,
    },
});