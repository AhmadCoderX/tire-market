import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { ResponsiveText, ResponsiveImage } from './index';

interface ResponsiveCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onPress?: () => void;
  style?: any;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  title,
  description,
  imageUrl,
  onPress,
  style,
}) => {
  const { isMobile, isTablet, isDesktop, spacing } = useResponsive();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMobile && styles.mobileContainer,
        isTablet && styles.tabletContainer,
        isDesktop && styles.desktopContainer,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ResponsiveImage
        source={{ uri: imageUrl }}
        aspectRatio={16/9}
        maxWidth={isDesktop ? 400 : isTablet ? 300 : 250}
        style={styles.image}
      />
      <View style={styles.content}>
        <ResponsiveText size={18} scale={1.2} style={styles.title}>
          {title}
        </ResponsiveText>
        <ResponsiveText size={14} style={styles.description}>
          {description}
        </ResponsiveText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileContainer: {
    width: '100%',
    marginBottom: 16,
  },
  tabletContainer: {
    width: '48%',
    marginBottom: 16,
  },
  desktopContainer: {
    width: '31%',
    marginBottom: 24,
  },
  image: {
    width: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    color: '#333333',
    fontWeight: 'bold',
  },
  description: {
    color: '#666666',
  },
});

export default ResponsiveCard; 