import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveGridProps {
  children: ReactNode;
  style?: ViewStyle;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  style,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 16,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
}) => {
  const { isXs, isSm, isMd, isLg, isXl, spacing } = useResponsive();
  
  // Determine number of columns based on screen size
  const getColumnCount = () => {
    if (typeof columns === 'number') {
      return columns;
    }
    
    if (isXl && columns.xl) return columns.xl;
    if (isLg && columns.lg) return columns.lg;
    if (isMd && columns.md) return columns.md;
    if (isSm && columns.sm) return columns.sm;
    if (isXs && columns.xs) return columns.xs;
    
    // Default fallbacks
    return 1;
  };
  
  const columnCount = getColumnCount();
  const gapSize = spacing(gap);
  
  return (
    <View
      style={[
        styles.grid,
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -gapSize / 2,
          marginVertical: -gapSize / 2,
          alignItems,
          justifyContent,
        },
        style,
      ]}
    >
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={[
            styles.gridItem,
            {
              width: `${100 / columnCount}%`,
              paddingHorizontal: gapSize / 2,
              paddingVertical: gapSize / 2,
            },
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    display: 'flex',
  },
  gridItem: {
    boxSizing: 'border-box',
  },
});

export default ResponsiveGrid; 