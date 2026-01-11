import React, { useState, useRef, useMemo, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Pressable } from 'react-native';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

type RollType = 'd3' | 'd6' | '2d6' | '2d6^';

interface RollOption {
  type: RollType;
  label: string;
  description: string;
}

const ROLL_OPTIONS: RollOption[] = [
  { type: 'd3', label: 'd3', description: 'Roll 1-3' },
  { type: 'd6', label: 'd6', description: 'Roll 1-6' },
  { type: '2d6', label: '2d6', description: 'Two dice, sum result' },
  { type: '2d6^', label: '2d6^', description: 'Two dice, show both' },
];

export function D6RollButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [rollResult, setRollResult] = useState<number | number[] | null>(null);
  const [rollLabel, setRollLabel] = useState<string>('d6');
  const bottomSheetRef = useRef<React.ComponentRef<typeof BottomSheetModal>>(null);
  const colors = Colors.dark;

  const snapPoints = useMemo(() => ['40%'], []);

  const rollDice = (type: RollType) => {
    let result: number | number[];
    let label: string;

    switch (type) {
      case 'd3':
        result = Math.floor(Math.random() * 3) + 1;
        label = 'd3';
        break;
      case 'd6':
        result = Math.floor(Math.random() * 6) + 1;
        label = 'd6';
        break;
      case '2d6':
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        result = die1 + die2;
        label = '2d6';
        break;
      case '2d6^':
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        result = [roll1, roll2];
        label = '2d6^';
        break;
    }

    setRollResult(result);
    setRollLabel(label);
    setModalVisible(true);
    (bottomSheetRef.current as any)?.dismiss();
  };

  const handlePress = () => {
    rollDice('d6'); // Default roll on regular press
  };

  const handleLongPress = () => {
    try {
      if (bottomSheetRef.current) {
        (bottomSheetRef.current as any).present();
      }
    } catch (error) {
      console.error('Error presenting bottom sheet:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => (bottomSheetRef.current as any)?.dismiss()}
      />
    ),
    []
  );

  const formatRollResult = () => {
    if (rollResult === null) return '';
    
    if (Array.isArray(rollResult)) {
      return `${rollResult[0]} and ${rollResult[1]}`;
    }
    return rollResult.toString();
  };

  return (
    <>
      <TouchableOpacity 
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={styles.rollButton}
        activeOpacity={0.8}
      >
        <View style={styles.rollContainer}>
          <Text style={styles.rollText}>Roll d6</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={closeModal}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>
              {rollLabel} roll result: {formatRollResult()}
            </Text>
            {Array.isArray(rollResult) && (
              <Text style={styles.modalSubtext}>
                Total: {rollResult[0] + rollResult[1]}
              </Text>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <BottomSheetModal
        ref={bottomSheetRef}
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
              <TouchableOpacity 
                onPress={() => (bottomSheetRef.current as any)?.dismiss()} 
                style={styles.closeButtonBottomSheet}
              >
                <Text style={styles.closeButtonTextBottomSheet}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsContainer}>
              {ROLL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  style={styles.optionButton}
                  onPress={() => rollDice(option.type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetView>
        </LinearGradient>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  rollButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  rollContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rollText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.accent,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: Colors.dark.borderSecondary,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.dark.text,
    lineHeight: 24,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: 8,
  },
  modalSubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
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
  closeButtonBottomSheet: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  closeButtonTextBottomSheet: {
    fontSize: 24,
    color: Colors.dark.textSecondary,
    fontWeight: '300',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.dark.textSecondary,
  },
});

