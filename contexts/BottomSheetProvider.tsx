import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRegion, RegionName } from './RegionContext';
import { Colors } from '@/constants/theme';

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

  const colors = Colors.dark;

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <LinearGradient
          colors={colors.backgroundSecondaryGradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select Region</Text>
              <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.radioContainer}>
              {REGIONS.map((regionOption) => {
                const isSelected = region === regionOption;
                return (
                  <TouchableOpacity
                    key={regionOption}
                    style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
                    onPress={() => handleRegionSelect(regionOption)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioButton, isSelected && styles.radioButtonSelectedContainer]}>
                      {isSelected && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {formatRegionName(regionOption)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BottomSheetView>
        </LinearGradient>
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
  bottomSheetBackground: {
    backgroundColor: 'transparent',
  },
  gradientBackground: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: Colors.dark.border,
    width: 40,
  },
  bottomSheetContent: {
    padding: 24,
    paddingBottom: 40,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.dark.textSecondary,
    fontWeight: '300',
  },
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  radioOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: Colors.dark.borderSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelectedContainer: {
    borderColor: Colors.dark.accent,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  radioLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  radioLabelSelected: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});

