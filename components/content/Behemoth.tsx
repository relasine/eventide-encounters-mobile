import { View, Text, StyleSheet } from "react-native"
import { Behemoth as BehemothType } from "@/constants/types"
import { Colors } from "@/constants/theme"

export const Behemoth = (props: { encounter: BehemothType, isAltar?: boolean }) => {
    const { encounter, isAltar } = props;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {isAltar ? <Text style={styles.name}>{encounter.name}</Text> : null}
                <View style={styles.badges}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {encounter.level}</Text>
                    </View>
                </View>
            </View>
            
            <Text style={styles.description}>{encounter.description}</Text>
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Health</Text>
                    <Text style={styles.statValue}>{encounter.health}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Attacks/Round</Text>
                    <Text style={styles.statValue}>{encounter.attacksPerRound}</Text>
                </View>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Blunder</Text>
                <Text style={styles.blunderName}>{encounter.blunder.name}</Text>
                <Text style={styles.blunderAction}>{encounter.blunder.action}</Text>
            </View>
            
            <View style={styles.rewardSection}>
                <Text style={styles.rewardLabel}>Reward</Text>
                <Text style={styles.rewardValue}>{encounter.reward}</Text>
            </View>
        </View>
)}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        marginBottom: 16,
        gap: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    levelBadge: {
        backgroundColor: Colors.dark.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    description: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    blunderName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.accent,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    blunderAction: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    rewardSection: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
    },
    rewardLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    rewardValue: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
    },
});