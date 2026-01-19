import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';

export function DefendRoll() {
  const colors = Colors.dark;
  const [displayText, setDisplayText] = useState<string>('Defend');
  const [isShowingResult, setIsShowingResult] = useState<boolean>(false);

  const handlePress = () => {
    // Add haptic feedback
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isShowingResult) {
      // If showing a result, reset to "Defend"
      setDisplayText('Defend');
      setIsShowingResult(false);
    } else {
      // If showing "Defend", generate and show result
      const d4 = Math.floor(Math.random() * 4) + 1;
      const d6 = Math.floor(Math.random() * 6) + 1;
      setDisplayText(`${d4} | ${d6}`);
      setIsShowingResult(true);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.rollButton}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          colors.backgroundSecondaryGradient as [string, string, ...string[]]
        }
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
