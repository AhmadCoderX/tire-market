import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface ChatAdBannerProps {
  position: 'left' | 'right';
  onPress?: () => void;
}

const ChatAdBanner: React.FC<ChatAdBannerProps> = ({ position, onPress }) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: { window: any }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;
  const isMobile = width < 768;
  
  // Calculate available space for ads
  const minWidthForAds = 1500; // Chat needs more space due to wider layout
  const adWidth = 160;
  const contentMaxWidth = 1200; // Chat content max width
  const contentPadding = 40; // 20px on each side
  const adMargin = 20;
  
  // Calculate if there's enough space for ads
  const availableSpace = width - contentMaxWidth - contentPadding;
  const spaceNeededPerSide = adWidth + adMargin * 2; // ad width + margins
  const hasEnoughSpace = availableSpace >= spaceNeededPerSide * 2;
  
  // Hide ads if not enough space or on mobile
  if (isMobile || !hasEnoughSpace || width < minWidthForAds) {
    return null;
  }

  const handlePress = () => {
    console.log(`Chat ad banner ${position} pressed`);
    if (onPress) {
      onPress();
    }
  };

  const isLeft = position === 'left';
  
  // Calculate dynamic positioning based on available space
  const sideSpace = (width - contentMaxWidth) / 2;
  const adPosition = sideSpace - adWidth - adMargin;

  return (
    <View style={[
      styles.container,
      {
        [isLeft ? 'left' : 'right']: Math.max(adMargin, adPosition),
        width: adWidth,
      }
    ]}>
      <TouchableOpacity 
        style={[
          styles.banner,
          isLeft ? styles.leftBanner : styles.rightBanner
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={[styles.header, isLeft ? styles.leftHeader : styles.rightHeader]}>
            <Text style={styles.headerIcon}>{isLeft ? '💬' : '🔔'}</Text>
            <Text style={styles.headerText}>
              {isLeft ? 'CHAT+' : 'ALERTS'}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>
              {isLeft ? 'Enhanced Messaging' : 'Smart Notifications'}
            </Text>
            <Text style={styles.subtitle}>
              {isLeft 
                ? 'Advanced chat features for better communication with buyers'
                : 'Stay informed with instant alerts and never miss a message'
              }
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {isLeft ? 'Read receipts' : 'Push notifications'}
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {isLeft ? 'Typing indicators' : 'Email alerts'}
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                {isLeft ? 'File sharing' : 'SMS updates'}
              </Text>
            </View>
          </View>

          {/* CTA */}
          <View style={[styles.cta, isLeft ? styles.leftCta : styles.rightCta]}>
            <Text style={styles.ctaText}>
              {isLeft ? 'Upgrade Chat' : 'Enable Alerts'}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLeft ? '⭐ Better Communication' : '⭐ Never Miss a Sale'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 210, // Position moved down to avoid covering dropdown menus
    height: 600,
    zIndex: 5,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  leftBanner: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  rightBanner: {
    backgroundColor: '#fff',
    borderRightWidth: 4,
    borderRightColor: '#FF6B6B',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  leftHeader: {
    borderBottomColor: '#007BFF',
  },
  rightHeader: {
    borderBottomColor: '#FF6B6B',
  },
  headerIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
    color: '#666',
  },
  mainContent: {
    flex: 1,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 15,
  },
  features: {
    paddingVertical: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 14,
    color: '#007BFF',
    marginRight: 8,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    color: '#34495E',
    flex: 1,
    lineHeight: 14,
  },
  cta: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  leftCta: {
    backgroundColor: '#007BFF',
  },
  rightCta: {
    backgroundColor: '#FF6B6B',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    color: '#95A5A6',
    textAlign: 'center',
  },
});

export default ChatAdBanner; 