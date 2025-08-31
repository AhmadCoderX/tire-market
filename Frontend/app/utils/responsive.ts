import { Dimensions, Platform, ScaledSize } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Define breakpoints for different screen sizes
export const BREAKPOINTS = {
  xs: 0,      // Extra small devices (phones)
  sm: 576,    // Small devices (tablets)
  md: 768,    // Medium devices (tablets)
  lg: 992,    // Large devices (desktops)
  xl: 1200,   // Extra large devices (large desktops)
  xxl: 1400,  // Extra extra large devices
};

// Get current window dimensions
export const getWindowDimensions = (): ScaledSize => {
  return Dimensions.get('window');
};

// Check if the current screen size is within a specific breakpoint range
export const isScreenSize = (min: keyof typeof BREAKPOINTS, max?: keyof typeof BREAKPOINTS): boolean => {
  const { width } = getWindowDimensions();
  
  if (max) {
    return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
  }
  
  return width >= BREAKPOINTS[min];
};

// Responsive width calculation
export const responsiveWidth = (percentage: number): number => {
  return wp(percentage);
};

// Responsive height calculation
export const responsiveHeight = (percentage: number): number => {
  return hp(percentage);
};

// Responsive font size calculation
export const responsiveFontSize = (size: number): number => {
  const { width } = getWindowDimensions();
  
  // Base font size on smaller screens
  if (width < BREAKPOINTS.sm) {
    return size * 0.8;
  }
  
  // Slightly larger on medium screens
  if (width < BREAKPOINTS.md) {
    return size * 0.9;
  }
  
  // Full size on larger screens
  return size;
};

// Responsive spacing calculation
export const responsiveSpacing = (size: number): number => {
  const { width } = getWindowDimensions();
  
  // Smaller spacing on smaller screens
  if (width < BREAKPOINTS.sm) {
    return size * 0.7;
  }
  
  // Medium spacing on medium screens
  if (width < BREAKPOINTS.md) {
    return size * 0.85;
  }
  
  // Full spacing on larger screens
  return size;
};

// Get number of columns based on screen size
export const getColumnCount = (): number => {
  const { width } = getWindowDimensions();
  
  if (width < BREAKPOINTS.sm) {
    return 1; // 1 column on mobile
  } else if (width < BREAKPOINTS.md) {
    return 2; // 2 columns on small tablets
  } else if (width < BREAKPOINTS.lg) {
    return 3; // 3 columns on tablets
  } else if (width < BREAKPOINTS.xl) {
    return 4; // 4 columns on small desktops
  } else {
    return 5; // 5 columns on large desktops
  }
};

// Check if device is mobile
export const isMobile = (): boolean => {
  const { width } = getWindowDimensions();
  return width < BREAKPOINTS.sm;
};

// Check if device is tablet
export const isTablet = (): boolean => {
  const { width } = getWindowDimensions();
  return width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
};

// Check if device is desktop
export const isDesktop = (): boolean => {
  const { width } = getWindowDimensions();
  return width >= BREAKPOINTS.lg;
};

// Add window resize listener
export const addResizeListener = (callback: () => void): (() => void) => {
  const subscription = Dimensions.addEventListener('change', callback);
  return () => subscription.remove();
}; 