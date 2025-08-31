import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';

interface ResponsiveImageProps {
  source: { uri: string };
  aspectRatio: number;
  maxWidth: number;
  style?: StyleProp<ImageStyle>;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  aspectRatio,
  maxWidth,
  style,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const width = isDesktop ? maxWidth : isTablet ? maxWidth * 0.8 : maxWidth * 0.6;
  const height = width / aspectRatio;

  return (
    <Image
      source={source}
      style={[
        { width, height },
        style,
      ]}
      resizeMode="cover"
    />
  );
};

export default ResponsiveImage; 