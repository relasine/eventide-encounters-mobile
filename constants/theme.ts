/**
 * Design system colors based on premium dark theme with purple accents
 * Following the design guidelines from design.json
 */

import { Platform } from 'react-native';

// Primary brand color - glowing purple
const purplePrimary = '#8b5cf6';
const purpleLight = '#a78bfa';
const purpleDark = '#6d28d9';
const purpleLighter = '#c4b5fd';

// Dark gradient backgrounds
const backgroundPrimaryStart = '#0a0e27';
const backgroundPrimaryEnd = '#1a1a3e';
const backgroundSecondaryStart = '#151520';
const backgroundSecondaryEnd = '#1f1f3a';
const backgroundTertiary = '#0f0f1f';

// Text colors
const textPrimary = '#ffffff';
const textSecondary = '#e5e7eb';
const textTertiary = '#6b7280';
const textMuted = '#9ca3af';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: purplePrimary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: purplePrimary,
  },
  dark: {
    // Text colors
    text: textPrimary,
    textSecondary: textSecondary,
    textTertiary: textTertiary,
    textMuted: textMuted,
    
    // Background colors
    background: backgroundPrimaryStart,
    backgroundPrimary: backgroundPrimaryStart,
    backgroundSecondary: backgroundSecondaryStart,
    backgroundTertiary: backgroundTertiary,
    
    // Gradient colors
    backgroundGradient: [backgroundPrimaryStart, backgroundPrimaryEnd],
    backgroundSecondaryGradient: [backgroundSecondaryStart, backgroundSecondaryEnd],
    
    // Accent colors
    tint: purplePrimary,
    accent: purplePrimary,
    accentLight: purpleLight,
    accentDark: purpleDark,
    accentGradient: [purplePrimary, purpleLight],
    
    // Icon and tab colors
    icon: textMuted,
    tabIconDefault: textMuted,
    tabIconSelected: purplePrimary,
    
    // Border colors
    border: 'rgba(255, 255, 255, 0.1)',
    borderSecondary: 'rgba(139, 92, 246, 0.3)',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
