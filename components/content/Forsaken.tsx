import { Enemy } from "@/constants/types"
import { View, Text } from "react-native"

export const Forsaken = (props: { encounter: Enemy }) => {
    const { encounter } = props;

    return (
        <View>
            <Text>Name: {encounter.name}</Text>
            <Text>Description: {encounter.description}</Text>
            <Text>Level: {encounter.level}</Text>
            <Text>Qty: {encounter.qty}</Text>
            <Text>Blunder: {encounter.blunder.name} - {encounter.blunder.action}</Text>
        </View>
    )
}