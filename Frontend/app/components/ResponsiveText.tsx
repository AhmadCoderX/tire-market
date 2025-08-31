import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { FONTS } from '../constants/fonts';

interface ResponsiveTextProps extends TextProps {
  size?: number;
  scale?: number;
  responsive?: boolean;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  style,
  size = 16,
  scale = 1,
  responsive = true,
  ...props
}) => {
  const { fs } = useResponsive();
  
  // Calculate font size based on screen size if responsive is true
  const fontSize = responsive ? fs(size * scale) : size * scale;
  
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#333333',
    fontFamily: FONTS.primary.regular,
    letterSpacing: 0,
  },
});

export default ResponsiveText; 