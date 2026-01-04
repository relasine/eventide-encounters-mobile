import { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';

export default function SearchScreen() {
    const { region } = useRegion();
    const [searchResults, setSearchResults] = useState<any | null>(null);

    const search = async () => {
        setSearchResults(null);

        try {
            const response = await fetch(`http://localhost:3001/api/v1/search/${region}`);
            const data = await response.json();
            setSearchResults(data.search);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1, paddingTop: 100, paddingHorizontal: 20, alignItems: 'center' }}>
            <RegionSelector />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Search Results</Text>
            {searchResults && (
            <View style={{ width: "100%"}}>
                    <Text>Result: {searchResults.name}</Text>
                    <Text>Action: {searchResults.action}</Text>
                    {searchResults?.affects ? <Text>Affected heroes: {searchResults.affects}</Text> : null}
                </View>
            )}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.searchButton} onPress={search}><Text>Search</Text></TouchableOpacity>
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
    searchButton: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 30,
      }
});