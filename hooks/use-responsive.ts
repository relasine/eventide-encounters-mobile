import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Breakpoints, BreakpointKey, getBreakpoint, isBreakpoint } from '@/constants/breakpoints';

export interface ResponsiveValues {
  width: number;
  height: number;
  breakpoint: BreakpointKey;
  isTablet: boolean;
  isDesktop: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

/**
 * Hook to get responsive dimensions and breakpoint information
 * Updates automatically on screen size changes
 */
export function useResponsive(): ResponsiveValues {
  const [dimensions, setDimensions] = useState<ScaledSize>(() => 
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;
  const breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    breakpoint,
    isTablet: isBreakpoint(width, 'tablet'),
    isDesktop: isBreakpoint(width, 'desktop'),
    isSmall: width < Breakpoints.medium,
    isMedium: width >= Breakpoints.medium && width < Breakpoints.tablet,
    isLarge: width >= Breakpoints.large && width < Breakpoints.tablet,
  };
}

/**
 * Get responsive value based on breakpoint
 * Returns different values for different screen sizes
 */
export function useResponsiveValue<T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T {
  const { breakpoint } = useResponsive();
  
  if (breakpoint === 'desktop' && values.desktop !== undefined) {
    return values.desktop;
  }
  if (breakpoint === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  if (breakpoint === 'large' && values.large !== undefined) {
    return values.large;
  }
  if (breakpoint === 'medium' && values.medium !== undefined) {
    return values.medium;
  }
  if (breakpoint === 'small' && values.small !== undefined) {
    return values.small;
  }
  return values.default;
}

