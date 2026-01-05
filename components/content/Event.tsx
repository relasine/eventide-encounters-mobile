import { View, Text, StyleSheet } from "react-native"
import { Event as EventType, EventDungeon } from "@/constants/types"
import { Colors } from "@/constants/theme"

export const Event = ({encounter}: { encounter: EventType }) => {
    const colors = Colors.dark;
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.idBadge}>
                    <Text style={styles.idText}>#{encounter.id}</Text>
                </View>
                <Text style={styles.title}>Event</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.action}>{encounter.action}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    idBadge: {
        backgroundColor: Colors.dark.backgroundTertiary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    idText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.dark.accent,
        fontFamily: 'monospace',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    content: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
    },
    action: {
        fontSize: 16,
        color: Colors.dark.text,
        lineHeight: 24,
        fontWeight: '400',
    },
});

    
    