import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, Text, Animated } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { MaterialIcons } from '@expo/vector-icons';

interface NavItem {
  label: string;
  icon?: string;
  onPress: () => void;
  active?: boolean;
}

interface ResponsiveNavigationProps {
  items: NavItem[];
  style?: ViewStyle;
  mobileBreakpoint?: number;
  showLabels?: boolean;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  style,
  mobileBreakpoint = 768,
  showLabels = true,
}) => {
  const { width, isMobile } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fadeAnim = new Animated.Value(0);
  
  // Determine if we should show mobile navigation
  const shouldShowMobileNav = width < mobileBreakpoint || isMobile;
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isMobileMenuOpen]);
  
  // Render desktop navigation
  const renderDesktopNav = () => {
    return (
      <View style={[styles.desktopNav, style]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.navItem,
              item.active && styles.activeNavItem,
            ]}
            onPress={item.onPress}
          >
            {item.icon && (
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={item.active ? '#588157' : '#333333'} 
                style={styles.icon}
              />
            )}
            {showLabels && (
              <Text style={[
                styles.navLabel,
                item.active && styles.activeNavLabel,
              ]}>
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render mobile navigation
  const renderMobileNav = () => {
    return (
      <View style={styles.mobileNavContainer}>
        {/* Mobile menu toggle button */}
        <TouchableOpacity 
          style={styles.mobileMenuToggle}
          onPress={toggleMobileMenu}
        >
          <MaterialIcons 
            name={isMobileMenuOpen ? 'close' : 'menu'} 
            size={24} 
            color="#333333" 
          />
        </TouchableOpacity>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <Animated.View style={[styles.mobileMenu, { opacity: fadeAnim }]}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.mobileNavItem,
                  item.active && styles.activeMobileNavItem,
                ]}
                onPress={() => {
                  item.onPress();
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon && (
                  <MaterialIcons 
                    name={item.icon as any} 
                    size={24} 
                    color={item.active ? '#588157' : '#333333'} 
                    style={styles.mobileIcon}
                  />
                )}
                <Text style={[
                  styles.mobileNavLabel,
                  item.active && styles.activeMobileNavLabel,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };
  
  return shouldShowMobileNav ? renderMobileNav() : renderDesktopNav();
};

const styles = StyleSheet.create({
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeNavItem: {
    backgroundColor: 'rgba(88, 129, 87, 0.1)',
  },
  icon: {
    marginRight: 8,
  },
  navLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#588157',
    fontWeight: '600',
  },
  mobileNavContainer: {
    position: 'relative',
  },
  mobileMenuToggle: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activeMobileNavItem: {
    backgroundColor: 'rgba(88, 129, 87, 0.1)',
  },
  mobileIcon: {
    marginRight: 16,
  },
  mobileNavLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  activeMobileNavLabel: {
    color: '#588157',
    fontWeight: '600',
  },
});

export default ResponsiveNavigation; 