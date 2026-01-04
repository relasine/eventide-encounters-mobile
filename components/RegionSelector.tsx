import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRegion } from '@/contexts/RegionContext';
import { useBottomSheet } from '@/contexts/BottomSheetProvider';

const formatRegionName = (region: string): string => {
  return region.charAt(0).toUpperCase() + region.slice(1);
};

export function RegionSelector() {
  const { region } = useRegion();
  const { openBottomSheet } = useBottomSheet();

  return (
    <TouchableOpacity onPress={openBottomSheet} style={styles.regionButton}>
      <Text style={styles.regionText}>{formatRegionName(region)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  regionButton: {
    padding: 10,
    marginBottom: 10,
  },
  regionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

