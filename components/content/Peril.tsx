import { Peril as PerilType } from "@/constants/types"
import { View, Text, StyleSheet } from "react-native"

export const Peril = (props: { encounter: PerilType }) => {
    const { encounter } = props;

    return (
        <View> 
            <Text><Text style={styles.labelText}>Result: </Text>{encounter.name}</Text>
            <Text><Text style={styles.labelText}>Action: </Text>{encounter.action}</Text>
            {encounter?.affects ? <Text><Text style={styles.labelText}>Affected heroes: </Text>{encounter.affects}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    labelText: {
        fontWeight: 'bold',
    },
})