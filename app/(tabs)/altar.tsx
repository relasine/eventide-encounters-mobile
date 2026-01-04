import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import { useState } from 'react';

import { Behemoth } from '../../components/content/Behemoth';
import { Peril } from '../../components/content/Peril';
import { Horde } from '../../components/content/Horde';
import { MasterBehemoth } from '@/components/content/MasterBehemoth';
import { useRegion } from '@/contexts/RegionContext';
import { RegionSelector } from '@/components/RegionSelector';

export default function AltarScreen() {
  const { region } = useRegion();
  const [altarResponse, setAltarResponse] = useState<any | null>(null);
  const [rollModifier, setRollModifier] = useState<number>(0);

  const generateAltarResponse = async () => {
    setAltarResponse(null);
    const response = await fetch(`http://localhost:3001/api/v1/altar/${region}/${rollModifier}`);
    const data = await response.json();
    setAltarResponse(data.altarResult);
    setRollModifier(rollModifier + 1);
  }

  const generateBehemoth = async () => {
    setAltarResponse(null)
    const response = await fetch(`http://localhost:3001/api/v1/behemoth/${region}`);
    const data = await response.json();
    setAltarResponse(data.altarResult);
  }

  const decrementRollModifier = () => {
    if (rollModifier > 0) {
      setRollModifier(rollModifier - 1);
    }
  }

  const incrementRollModifier = () => {
    setRollModifier(rollModifier + 1);
  }
  
  return (
    <View style={{ flex: 1, paddingTop: 100, width: '100%', alignItems: 'center' }}>
        <RegionSelector />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Altar</Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <Text>Roll Modifier: </Text>
                <TouchableOpacity disabled={rollModifier <= 0} style={styles.plusMinusButton} onPress={decrementRollModifier}><Text style={{ textAlign: 'center' }}>-</Text></TouchableOpacity>
                 <Text style={{width: 20, textAlign: 'center'}} >{rollModifier}</Text> 
                <TouchableOpacity style={styles.plusMinusButton} onPress={incrementRollModifier}><Text style={{ textAlign: 'center' }}>+</Text></TouchableOpacity>
        </View>
        {altarResponse ? 
            <View style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
                {altarResponse.result !== 'Master Behemoth' ? 
                <>  
                <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.labelText}>Altar Response: </Text>
                    <Text style={{ fontStyle: 'italic'}}>{altarResponse.result}</Text>
                    {" - "}{altarResponse.altarAction}
                    </Text>
                    </>
                : null
                }
                {(altarResponse.result === 'Ambush' && altarResponse.ambush) ? 
                    <>
                        <Text style={{...styles.labelText, marginBottom: 8, textAlign: 'center' }}>Ambush Result</Text>
                        <Horde encounter={altarResponse.ambush} />
                    </> 
                : null}
                {(altarResponse.result === 'Behemoth' && altarResponse.behemoth) ?
                    <>
                        <Text style={{...styles.labelText, marginBottom: 8, textAlign: 'center' }}>Behemoth Result</Text>
                        <Behemoth encounter={altarResponse.behemoth} />
                    </> 
                : null}
                {(altarResponse.result === 'Peril' && altarResponse.peril) ?
                    <>
                        <Text style={{...styles.labelText, marginBottom: 8, textAlign: 'center' }}>Peril Result</Text>
                        <Peril encounter={altarResponse.peril} />
                    </> 
                : null}
                {(altarResponse.result === 'Master Behemoth' && altarResponse.masterBehemoth) ? <MasterBehemoth encounter={altarResponse.masterBehemoth} generateBehemoth={generateBehemoth} />  : null}
                {altarResponse.reward ? 
                    <Text style={{ marginVertical: 8 }}>
                        <Text style={styles.labelText}>Reward: </Text>
                        <Text style={{ fontStyle: 'italic'}}>{altarResponse.reward}</Text>
                    </Text> 
                : null }
            </View> : <View style={{ flex: 1, width: '100%', paddingHorizontal: 20 }} />
        }
        <View style={{ alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: 'black', height: 80, width: '100%'}}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.dungeonButton} onPress={generateAltarResponse}><Text style={{ textAlign: 'center' }}>Roll Altar</Text></TouchableOpacity>
                {rollModifier > 0 ? <TouchableOpacity style={styles.dungeonButton} onPress={() => setRollModifier(0)}><Text style={{ textAlign: 'center' }}>Reset Modifier</Text></TouchableOpacity> : <DisabledButton />}
            </View>
        </View>    
    </View>
  );
}

const DisabledButton = () => {
    return (
        <TouchableOpacity disabled={true} style={{...styles.dungeonButton, ...styles.disabledButton}} onPress={() => {}}><Text style={{ ...styles.disabledText, textAlign: 'center' }}>Reset Modifier</Text></TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dungeonButton: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        width: 150
    },
    labelText: {
        fontWeight: 'bold',
    },
    plusMinusButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        top: -8
    },
    disabledButton : {
        borderColor: 'gray',
    },
    disabledText: {
        color: 'gray',
    }
});
