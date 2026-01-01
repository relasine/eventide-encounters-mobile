import { View, Text, StyleSheet } from "react-native"
import { Behemoth as BehemothType } from "@/constants/types"

export const Behemoth = (props: { encounter: BehemothType }) => {
    const { encounter } = props;
    return (
        <View>
            <Text><Text style={styles.labelText}>{encounter.name}: </Text>{encounter.description}</Text>
            <Text><Text style={styles.labelText}>Level: </Text>{encounter.level}</Text>
            <Text><Text style={styles.labelText}>Health: </Text>{encounter.health}</Text>
            <Text><Text style={styles.labelText}>Attacks Per Round: </Text>{encounter.attacksPerRound}</Text>
            <Text><Text style={styles.labelText}>Blunder: </Text><Text style={{ fontStyle: 'italic'}}>{encounter.blunder.name}</Text> - {encounter.blunder.action}</Text>
            <Text style={{ marginTop: 8 }}><Text style={styles.labelText}>Reward: </Text>{encounter.reward}</Text>
        </View>
)}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold',
    },
});