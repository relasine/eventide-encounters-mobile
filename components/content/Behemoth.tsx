import { View, Text, StyleSheet } from "react-native"
import { Behemoth as BehemothType } from "@/constants/types"
import { Colors } from "@/constants/theme"

export const Behemoth = (props: { encounter: BehemothType }) => {
    const { encounter } = props;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{encounter.name}</Text>
            </View>
            
            <Text style={styles.description}>{encounter.description}</Text>
            
            <View style={styles.levelContainer}>
                <View style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Level</Text>
                    <Text style={styles.levelValue}>{encounter.level}</Text>
                </View>
            </View>
            
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        flex: 1,
        lineHeight: 30,
    },
    description: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        marginBottom: 20,
    },
    levelContainer: {
        marginBottom: 16,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
    },
    levelItem: {
        alignItems: 'center',
    },
    levelLabel: {
        fontSize: 14,
        color: Colors.dark.accent,
        marginBottom: 3,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    levelValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.accent,
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