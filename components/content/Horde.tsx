import { Enemy } from "@/constants/types"
import { View, Text, StyleSheet } from "react-native"

export const Horde = (props: { encounter: Enemy }) => {
    const { encounter } = props;

    return (
        <View>
            <Text><Text style={styles.labelText}>{encounter.name}: </Text>{encounter.description}</Text>
            <Text><Text style={styles.labelText}>Level: </Text>{encounter.level}</Text>
            <Text><Text style={styles.labelText}>Qty: </Text>{encounter.qty}</Text>
            <Text><Text style={styles.labelText}>Blunder: </Text><Text style={{ fontStyle: 'italic'}}>{encounter.blunder.name}</Text> - {encounter.blunder.action}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold',
    },
});