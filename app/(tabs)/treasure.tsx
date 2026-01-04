import { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';

export default function SearchScreen() {
    const { region } = useRegion();
    const [treasureResults, setTreasureResults] = useState<any | null>(null);

    const search = async () => {
        setTreasureResults(null);

        try {
            const response = await fetch(`http://localhost:3001/api/v1/treasure/${region}`);
            const data = await response.json();
            setTreasureResults(data.treasure);
        } catch (error) {
            console.error(error);
        }
    }

    const isWeapon = () => {
        return treasureResults?.item?.type === 'One-Handed' || treasureResults?.item?.type === 'Two-Handed'
    }

    return (
        <View style={{ flex: 1, paddingTop: 100, paddingHorizontal: 20, alignItems: 'center' }}>
            <RegionSelector />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Treasure Results</Text>
            {treasureResults && (
                <View style={{ width: "100%"}}>
                    {treasureResults.item ? <View>
                        {isWeapon() ? 
                            <Text style={styles.treasureItem}>{treasureResults.item.type} {treasureResults.item.weaponType} Weapon</Text> : <Text style={styles.treasureItem}>{treasureResults.item.type}</Text>
                        }
                        <Text>
                            <Text style={styles.labelText}>Effect: </Text><Text style={{ fontStyle: 'italic'}}>{treasureResults.item.name}</Text> - {treasureResults.item.action}
                        </Text>
                        {treasureResults.item.actionType ? <Text><Text style={styles.labelText}>Action Type: </Text>{treasureResults.item.actionType}</Text> : null}
                        {isWeapon() ? <Text><Text style={styles.labelText}>Charges: </Text>{treasureResults.item.charges}</Text> : null}
                        {treasureResults.item.stacking ? <Text><Text style={styles.labelText}>Stacking: </Text>{treasureResults.item.stacking}</Text> : null}
                    </View> : null}
                    {treasureResults.glowstone ? <Text style={styles.glowStoneText}><Text style={styles.labelText}>Glowstone: </Text>{treasureResults.glowstone}</Text> : null}
                </View>
            )}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.treasureButton} onPress={search}><Text>Discover Treasure</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    treasureButton: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 30,
    },
    treasureItem: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingBottom: 8
    },
    glowStoneText: {
        marginTop: 8
    },
    labelText: {
        fontWeight: 'bold',
    }
});