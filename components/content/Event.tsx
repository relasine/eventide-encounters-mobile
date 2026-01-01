import { View, Text } from "react-native"
import { Event as EventType, EventDungeon } from "@/constants/types"

export const Event = ({encounter}: { encounter: EventType }) => {
    return (
        <View>
            <Text>Action ({encounter.id}): {encounter.action}</Text>
        </View>
    )
}

    
    