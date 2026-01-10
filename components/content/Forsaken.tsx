import { Enemy } from "@/constants/types"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/theme"

export const Forsaken = (props: { encounter: Enemy }) => {
    const { encounter } = props;
    const colors = Colors.dark;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.badges}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {encounter.level}</Text>
                    </View>
                    <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>QTY: {encounter.qty}</Text>
                    </View>
                </View>
            </View>
            
            <Text style={styles.description}>{encounter.description}</Text>
            
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
    )
}

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
    qtyBadge: {
        backgroundColor: Colors.dark.backgroundTertiary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    qtyText: {
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
    blunderSection: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginBottom: 16
    },
    blunderLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
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
    section: {
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});