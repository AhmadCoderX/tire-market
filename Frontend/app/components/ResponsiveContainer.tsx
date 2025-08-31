import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  fluid?: boolean;
  maxWidth?: number;
  padding?: number | { horizontal?: number; vertical?: number };
  center?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  fluid = false,
  maxWidth = 1200,
  padding = 16,
  center = true,
}) => {
  const { width, wp, spacing } = useResponsive();
  
  // Calculate container width based on fluid prop and screen size
  const containerWidth = fluid ? '100%' : Math.min(width, maxWidth);
  
  // Calculate padding based on screen size
  const horizontalPadding = typeof padding === 'number' 
    ? spacing(padding) 
    : spacing(padding.horizontal || 16);
  
  const verticalPadding = typeof padding === 'number' 
    ? spacing(padding) 
    : spacing(padding.vertical || 16);
  
  return (
    <View
      style={[
        styles.container,
        {
          width: containerWidth,
          paddingHorizontal: horizontalPadding,
          paddingVertical: verticalPadding,
          alignSelf: center ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ResponsiveContainer; 