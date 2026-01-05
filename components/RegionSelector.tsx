import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion } from '@/contexts/RegionContext';
import { useBottomSheet } from '@/contexts/BottomSheetProvider';
import { Colors } from '@/constants/theme';

const formatRegionName = (region: string): string => {
  return region.charAt(0).toUpperCase() + region.slice(1);
};

export function RegionSelector() {
  const { region } = useRegion();
  const { openBottomSheet } = useBottomSheet();
  const colors = Colors.dark;

  return (
    <TouchableOpacity 
      onPress={openBottomSheet} 
      style={styles.regionButton}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors.accentGradient as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.regionGradient}
      >
        <Text style={styles.regionText}>{formatRegionName(region)}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  regionButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  regionGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
});

