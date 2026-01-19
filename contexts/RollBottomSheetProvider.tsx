import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoll } from './RollContext';
import { randomRolls } from '@/constants/types';
import { Colors } from '@/constants/theme';

const ROLL_OPTIONS: randomRolls[] = ['d4', 'd6', '2d6', '2d6^'];

const formatRollLabel = (roll: randomRolls): string => {
  return `Roll ${roll}`;
};

interface RollBottomSheetContextType {
  openRollBottomSheet: () => void;
  closeRollBottomSheet: () => void;
}

const RollBottomSheetContext = createContext<RollBottomSheetContextType | undefined>(undefined);

export function RollBottomSheetProvider({ children }: { children: ReactNode }) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { roll, setRoll } = useRoll();

  const snapPoints = React.useMemo(() => {
    const screenHeight = Dimensions.get('window').height;
    const height = screenHeight * 0.45 + 32;
    return [height];
  }, []);

  const openRollBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeRollBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeRollBottomSheet}
      />
    ),
    [closeRollBottomSheet]
  );

  const handleRollSelect = (selectedRoll: randomRolls) => {
    setRoll(selectedRoll);
    closeRollBottomSheet();
  };

  const colors = Colors.dark;

  return (
    <RollBottomSheetContext.Provider value={{ openRollBottomSheet, closeRollBottomSheet }}>
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
              <Text style={styles.headerText}>Select Roll Type</Text>
              <TouchableOpacity onPress={closeRollBottomSheet} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.radioContainer}>
              {ROLL_OPTIONS.map((rollOption) => {
                const isSelected = roll === rollOption;
                return (
                  <TouchableOpacity
                    key={rollOption}
                    style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
                    onPress={() => handleRollSelect(rollOption)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioButton, isSelected && styles.radioButtonSelectedContainer]}>
                      {isSelected && <View style={styles.radioButtonSelected} />}
                    </View>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {formatRollLabel(rollOption)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BottomSheetView>
        </LinearGradient>
      </BottomSheet>
    </RollBottomSheetContext.Provider>
  );
}

export function useRollBottomSheet() {
  const context = useContext(RollBottomSheetContext);
  if (context === undefined) {
    throw new Error('useRollBottomSheet must be used within a RollBottomSheetProvider');
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
    paddingBottom: 60,
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

