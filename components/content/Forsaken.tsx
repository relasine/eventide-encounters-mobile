import { Enemy } from "@/constants/types"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/theme"

export const Forsaken = (props: { encounter: Enemy }) => {
    const { encounter } = props;
    const colors = Colors.dark;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{encounter.name}</Text>
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
            
            <View style={styles.blunderSection}>
                <Text style={styles.blunderLabel}>Blunder</Text>
                <Text style={styles.blunderName}>{encounter.blunder.name}</Text>
                <Text style={styles.blunderAction}>{encounter.blunder.action}</Text>
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
});