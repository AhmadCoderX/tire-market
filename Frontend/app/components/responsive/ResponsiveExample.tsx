import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveImage, ResponsiveNavigation } from './index';

const ResponsiveExample = () => {
  const { isMobile, isTablet, isDesktop, width, height, spacing, fs } = useResponsive();
  const [showMenu, setShowMenu] = useState(false);

  const navigationItems = [
    { label: 'Home', icon: 'home', onPress: () => {} },
    { label: 'Products', icon: 'shopping-cart', onPress: () => {} },
    { label: 'About', icon: 'info', onPress: () => {} },
    { label: 'Contact', icon: 'mail', onPress: () => {} },
  ];

  const gridItems = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}`,
    image: `https://picsum.photos/seed/${i + 1}/400/300`,
  }));

  return (
    <ScrollView style={styles.container}>
      <ResponsiveNavigation items={navigationItems} />

      <ResponsiveContainer>
        <View style={styles.screenInfo}>
          <ResponsiveText size={18} scale={1.2}>
            Screen Information
          </ResponsiveText>
          <Text style={styles.infoText}>
            Width: {width}px, Height: {height}px
          </Text>
          <Text style={styles.infoText}>
            Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
          </Text>
        </View>

        <View style={styles.section}>
          <ResponsiveText size={24} scale={1.2}>
            Responsive Grid Example
          </ResponsiveText>
          <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
            {gridItems.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <ResponsiveImage
                  source={{ uri: item.image }}
                  aspectRatio={4/3}
                  maxWidth={400}
                />
                <ResponsiveText size={16} scale={1.1}>
                  {item.title}
                </ResponsiveText>
                <Text style={styles.description}>
                  {item.description}
                </Text>
              </View>
            ))}
          </ResponsiveGrid>
        </View>

        <View style={styles.section}>
          <ResponsiveText size={24} scale={1.2}>
            Responsive Text Example
          </ResponsiveText>
          <View style={styles.textExamples}>
            <ResponsiveText size={12} scale={1.2}>
              Small Text (12px)
            </ResponsiveText>
            <ResponsiveText size={16} scale={1.2}>
              Medium Text (16px)
            </ResponsiveText>
            <ResponsiveText size={24} scale={1.2}>
              Large Text (24px)
            </ResponsiveText>
            <ResponsiveText size={32} scale={1.2}>
              Extra Large Text (32px)
            </ResponsiveText>
          </View>
        </View>

        <View style={styles.section}>
          <ResponsiveText size={24} scale={1.2}>
            Responsive Layout Example
          </ResponsiveText>
          <View style={[
            styles.layoutExample,
            isMobile && styles.mobileLayout,
            isTablet && styles.tabletLayout,
            isDesktop && styles.desktopLayout,
          ]}>
            <View style={styles.layoutItem}>
              <ResponsiveText size={16} scale={1.1}>
                Item 1
              </ResponsiveText>
            </View>
            <View style={styles.layoutItem}>
              <ResponsiveText size={16} scale={1.1}>
                Item 2
              </ResponsiveText>
            </View>
            <View style={styles.layoutItem}>
              <ResponsiveText size={16} scale={1.1}>
                Item 3
              </ResponsiveText>
            </View>
          </View>
        </View>
      </ResponsiveContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  screenInfo: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  textExamples: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  layoutExample: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  mobileLayout: {
    flexDirection: 'column',
  },
  tabletLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  desktopLayout: {
    flexDirection: 'row',
  },
  layoutItem: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ResponsiveExample; 