import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ability, MasterBehemoth as MasterBehemothType, Escalation as EscalationType, BackInTown as BackInTownType } from "@/constants/types"

export const MasterBehemoth = (props: { encounter: MasterBehemothType, generateBehemoth: () => void }) => {
    const { encounter, generateBehemoth } = props;

    return (
        <ScrollView style={{ flex: 1 }}>
            <Text style={styles.titleText}>{encounter.name}</Text>
            <TouchableOpacity style={styles.dungeonButton} onPress={generateBehemoth}><Text style={{ textAlign: 'center' }}>Roll for Behemoth</Text></TouchableOpacity>
            {encounter.description.map(sentence => <Text key={sentence} style={{ marginBottom: 8 }}>{sentence}</Text>)}
            <Text><Text style={styles.labelText}>Level: </Text>{encounter.level}</Text>
            <Text><Text style={styles.labelText}>Health: </Text>{encounter.health}</Text>
            <Text><Text style={styles.labelText}>Attacks Per Round: </Text>{encounter.attacksPerRound}</Text>
            <Abilities abilities={encounter.abilities} />
            <Escalation escalation={encounter.escalation} />
            <Rewards rewards={encounter.rewards} />
            <BackInTown backInTown={encounter.backInTown} />
        </ScrollView>
)}

const Abilities = (props: { abilities: Ability[] }) => {
    const { abilities } = props;
    return (
        <View style={{ marginVertical: 8 }}>
            <Text style={styles.labelText}>Abilities -</Text>
            {abilities.map(ability => 
            <View key={ability.name} style={{ marginBottom: 8 }}>
                    <Text>
                        <Text style={styles.labelText}>{ability.name}: </Text>
                        <Text style={{ fontStyle: 'italic'}}>{ability.trigger} - </Text>
                        {ability.action}
                    </Text>
                </View>)}
        </View>
    )
}

const Rewards = (props: { rewards: string[] }) => {
    const { rewards } = props;
    return (
        <View>
            <Text style={styles.labelText}>Rewards -</Text>
            {rewards.map(reward => <Text key={reward}>- {reward}</Text>)}
        </View>
    )
}

const Escalation = (props: { escalation: EscalationType[] }) => {
    const { escalation } = props;
    return (
        <View>
            <Text style={styles.labelText}>Escalation -</Text>
            {escalation.map(escalation => 
                <View style={{ marginBottom: 8 }} key={escalation.threshold}>
                    <Text>
                        <Text style={styles.labelText}>At {escalation.threshold} health: </Text>
                        {escalation.description}
                    </Text>
                </View>
            )}
        </View>
    )
}

const BackInTown = (props: { backInTown: BackInTownType }) => {
    const { backInTown } = props;
    return (
        <View style={{ marginVertical: 8 }}>
            <Text style={styles.labelText}>Back in Town -</Text>
            {backInTown.map(text => <Text key={text} style={{ marginBottom: 8 }}>{text}</Text>)}
        </View>
    )}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    dungeonButton: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: 150,
        alignSelf: 'center',
    },
});