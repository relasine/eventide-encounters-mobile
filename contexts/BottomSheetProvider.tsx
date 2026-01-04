import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRegion, RegionName } from './RegionContext';

const REGIONS: RegionName[] = ['sundessa', 'mantora', 'torgul', 'ridian', 'jakkar', 'olma'];

const formatRegionName = (region: RegionName): string => {
  return region.charAt(0).toUpperCase() + region.slice(1);
};

interface BottomSheetContextType {
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { region, setRegion } = useRegion();

  const snapPoints = React.useMemo(() => ['65%'], []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeBottomSheet}
      />
    ),
    [closeBottomSheet]
  );

  const handleRegionSelect = (selectedRegion: RegionName) => {
    setRegion(selectedRegion);
    closeBottomSheet();
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Select Region</Text>
            <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.radioContainer}>
            {REGIONS.map((regionOption) => (
              <TouchableOpacity
                key={regionOption}
                style={styles.radioOption}
                onPress={() => handleRegionSelect(regionOption)}
              >
                <View style={styles.radioButton}>
                  {region === regionOption && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioLabel}>{formatRegionName(regionOption)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  radioContainer: {
    gap: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  radioLabel: {
    fontSize: 16,
  },
});

