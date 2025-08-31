import { useState, useEffect } from 'react';
import { 
  getWindowDimensions, 
  isScreenSize, 
  responsiveWidth, 
  responsiveHeight, 
  responsiveFontSize, 
  responsiveSpacing,
  getColumnCount,
  isMobile,
  isTablet,
  isDesktop,
  addResizeListener,
  BREAKPOINTS
} from '../utils/responsive';

// Hook to get responsive values that update when window size changes
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(getWindowDimensions());
  const [columnCount, setColumnCount] = useState(getColumnCount());
  
  useEffect(() => {
    // Update dimensions and column count when window size changes
    const updateDimensions = () => {
      setDimensions(getWindowDimensions());
      setColumnCount(getColumnCount());
    };
    
    // Initial setup
    updateDimensions();
    
    // Add resize listener
    const removeListener = addResizeListener(updateDimensions);
    
    // Clean up
    return () => {
      removeListener();
    };
  }, []);
  
  return {
    // Current dimensions
    width: dimensions.width,
    height: dimensions.height,
    
    // Responsive calculations
    wp: responsiveWidth,
    hp: responsiveHeight,
    fs: responsiveFontSize,
    spacing: responsiveSpacing,
    
    // Screen size checks
    isXs: dimensions.width < BREAKPOINTS.sm,
    isSm: isScreenSize('sm', 'md'),
    isMd: isScreenSize('md', 'lg'),
    isLg: isScreenSize('lg', 'xl'),
    isXl: isScreenSize('xl', 'xxl'),
    isXxl: dimensions.width >= BREAKPOINTS.xxl,
    
    // Device type checks
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    
    // Grid system
    columnCount,
    
    // Breakpoint values
    breakpoints: BREAKPOINTS,
  };
}; 