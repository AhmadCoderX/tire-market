import React from 'react';
import { Image, ImageProps, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveImageProps extends Omit<ImageProps, 'style'> {
  containerStyle?: ViewStyle;
  imageStyle?: ImageProps['style'];
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  responsive?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  containerStyle,
  imageStyle,
  aspectRatio,
  maxWidth,
  maxHeight,
  responsive = true,
  ...props
}) => {
  const { width, wp, spacing } = useResponsive();
  
  // Calculate responsive dimensions if responsive is true
  const getResponsiveDimensions = () => {
    if (!responsive) return {};
    
    const dimensions: { width?: DimensionValue; height?: DimensionValue } = {};
    
    // Handle maxWidth
    if (maxWidth) {
      dimensions.width = Math.min(width, maxWidth);
    }
    
    // Handle maxHeight
    if (maxHeight) {
      dimensions.height = maxHeight;
    }
    
    // Handle aspect ratio
    if (aspectRatio) {
      if (dimensions.width) {
        dimensions.height = typeof dimensions.width === 'number' 
          ? dimensions.width / aspectRatio 
          : undefined;
      } else if (dimensions.height) {
        dimensions.width = typeof dimensions.height === 'number' 
          ? dimensions.height * aspectRatio 
          : undefined;
      }
    }
    
    return dimensions;
  };
  
  const responsiveDimensions = getResponsiveDimensions();
  
  return (
    <Image
      style={[
        styles.image,
        responsiveDimensions,
        imageStyle,
      ]}
      resizeMode="contain"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 'auto',
  },
});

export default ResponsiveImage; 