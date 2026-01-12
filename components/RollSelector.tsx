import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRoll } from '@/contexts/RollContext';
import { useRollBottomSheet } from '@/contexts/RollBottomSheetProvider';
import { Colors } from '@/constants/theme';
import { randomRolls } from '@/constants/types';

const formatRollLabel = (roll: string): string => {
  return `Roll ${roll}`;
};

const rollDice = (rollType: randomRolls): string => {
  const rollSingleDie = (): number => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const rollD4 = (): number => {
    return Math.floor(Math.random() * 4) + 1;
  };

  switch (rollType) {
    case 'd4': {
      const result = rollD4();
      return result.toString();
    }
    case 'd6': {
      const result = rollSingleDie();
      return result.toString();
    }
    case '2d6': {
      const die1 = rollSingleDie();
      const die2 = rollSingleDie();
      const sum = die1 + die2;
      return sum.toString();
    }
    case '2d6^': {
      const die1 = rollSingleDie();
      const die2 = rollSingleDie();
      return `${die1} | ${die2}`;
    }
    default:
      return '';
  }
};

export function RollSelector() {
  const { roll } = useRoll();
  const { openRollBottomSheet } = useRollBottomSheet();
  const colors = Colors.dark;
  const [displayText, setDisplayText] = useState<string>(formatRollLabel(roll));
  const [isShowingResult, setIsShowingResult] = useState<boolean>(false);

  useEffect(() => {
    // Update display text when roll changes
    setDisplayText(formatRollLabel(roll));
    setIsShowingResult(false);
  }, [roll]);

  const handlePress = () => {
    // Add haptic feedback
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isShowingResult) {
      // If showing a result, reset to roll label
      setDisplayText(formatRollLabel(roll));
      setIsShowingResult(false);
    } else {
      // If showing roll label, generate and show result
      const result = rollDice(roll);
      setDisplayText(result);
      setIsShowingResult(true);
    }
  };

  const handleLongPress = () => {
    openRollBottomSheet();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={styles.rollButton}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors.backgroundSecondaryGradient as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rollGradient}
      >
        <Text style={styles.rollText}>{displayText}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rollButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    shadowColor: Colors.dark.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rollGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  rollText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

