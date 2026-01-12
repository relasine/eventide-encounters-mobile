import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RegionProvider } from '@/contexts/RegionContext';
import { BottomSheetProvider } from '@/contexts/BottomSheetProvider';
import { RollProvider } from '@/contexts/RollContext';
import { RollBottomSheetProvider } from '@/contexts/RollBottomSheetProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RegionProvider>
        <RollProvider>
          <BottomSheetProvider>
            <RollBottomSheetProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="region-info" options={{ headerShown: false }} />
                  <Stack.Screen name="bestiary-entry" options={{ headerShown: false }} />
                  <Stack.Screen name="CreateCharacter" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="light" />
              </ThemeProvider>
            </RollBottomSheetProvider>
          </BottomSheetProvider>
        </RollProvider>
      </RegionProvider>
    </GestureHandlerRootView>
  );
}
