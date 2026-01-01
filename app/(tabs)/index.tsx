import { Image } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import { useState } from 'react';

import { Forsaken } from '../../components/content/Forsaken';
import { Behemoth } from '../../components/content/Behemoth';
import { Peril } from '../../components/content/Peril';
import { Event } from '../../components/content/Event';
import { BehemothDungeon, GeneratedDungeon, EnemyDungeon, EventDungeon, PerilDungeon } from '@/constants/types';
import { Horde } from '../../components/content/Horde';
import { useRegion } from '@/contexts/RegionContext';

export default function HomeScreen() {
  const { region } = useRegion();
  const [encounter, setEncounter] = useState<GeneratedDungeon | null>(null);

  const generateDungeon = async () => {
    setEncounter(null);
    const response = await fetch(`http://localhost:3001/api/v1/dungeon/${region}`);
    const data = await response.json();
    setEncounter(data);

    if (data.roomType === 'Event') {
      console.log(data.event);
    }
  }
  
  return (
    <View style={{ flex: 1, paddingTop: 100, paddingHorizontal: 20, alignItems: 'center' }}>
      <TouchableOpacity style={styles.dungeonButton} onPress={generateDungeon}><Text>Generate Dungeon</Text></TouchableOpacity>
      {encounter &&(
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={encounter.image}
            style={{ width: 200, height: 125, alignSelf: 'center', marginVertical: 20 }}
          />
          <Text>Roll: {encounter.dungeonNumber}</Text>
          <Text>Encounter Type: {encounter.roomType}</Text>
          <Text>{encounter.roomSubtype}</Text>
          <View style={{ paddingVertical: 20 }}>
            {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Behemoth' ? (
              <Behemoth encounter={(encounter as BehemothDungeon).enemy} />
            ) : null}
            {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Forsaken' ? (
              <Forsaken encounter={(encounter as EnemyDungeon).enemy} />
            ) : null}
            {encounter.roomType === 'Combat' && encounter.roomSubtype === 'Ambush' ? (
              <Horde encounter={(encounter as EnemyDungeon).enemy} />
            ) : null}
            {encounter.roomType === 'Event' && 'event' in encounter && (encounter as EventDungeon).event?.action ? (
              <Event encounter={(encounter as EventDungeon).event} />
            ) : null}
            {encounter.roomType === 'Peril & Altar' && encounter.roomSubtype === null ? (
              <Peril encounter={(encounter as PerilDungeon).peril} />
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  dungeonButton: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  }
});
