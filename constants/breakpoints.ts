/**
 * Breakpoints for responsive design
 * Based on device screen widths
 */

export const Breakpoints = {
  // Small phones (iPhone SE, etc.)
  small: 375,
  // Standard phones (iPhone 12/13/14, etc.)
  medium: 428,
  // Large phones (iPhone Pro Max, etc.)
  large: 480,
  // iPad Mini (6th gen: 744px, 5th gen: 768px)
  tablet: 744,
  // iPad and larger tablets
  desktop: 1024,
} as const;

export type BreakpointKey = keyof typeof Breakpoints;

/**
 * Check if current width matches or exceeds a breakpoint
 */
export const isBreakpoint = (width: number, breakpoint: BreakpointKey): boolean => {
  return width >= Breakpoints[breakpoint];
};

/**
 * Get the current breakpoint category based on width
 */
export const getBreakpoint = (width: number): BreakpointKey => {
  if (width >= Breakpoints.desktop) return 'desktop';
  if (width >= Breakpoints.tablet) return 'tablet';
  if (width >= Breakpoints.large) return 'large';
  if (width >= Breakpoints.medium) return 'medium';
  return 'small';
};

