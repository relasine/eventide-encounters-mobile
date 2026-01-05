import { Peril as PerilType } from "@/constants/types"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/theme"

export const Peril = (props: { encounter: PerilType }) => {
    const { encounter } = props;
    const colors = Colors.dark;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.resultLabel}>Result</Text>
                <Text style={styles.name}>{encounter.name}</Text>
            </View>
            
            <View style={styles.actionSection}>
                <Text style={styles.actionLabel}>Action</Text>
                <Text style={styles.action}>{encounter.action}</Text>
            </View>
            
            {encounter?.affects && (
                <View style={styles.affectsSection}>
                    <Text style={styles.affectsLabel}>Affected Heroes</Text>
                    <Text style={styles.affects}>{encounter.affects}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        marginBottom: 20,
    },
    resultLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        lineHeight: 30,
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
    action: {
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
    affects: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
})