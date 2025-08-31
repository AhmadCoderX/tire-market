import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";

const { width } = Dimensions.get('window');
const isMobile = width < 768;

interface AdBannerProps {
  onPress?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default action - could open a URL or navigate
      console.log('Advertisement clicked');
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.adContent}>
        {/* Ad Header */}
        <View style={styles.adHeader}>
          <Text style={styles.adLabel}>ADVERTISEMENT</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        </View>

        {/* Main Ad Content */}
        <View style={styles.mainContent}>
          <View style={styles.textContent}>
            <Text style={styles.adTitle}>Premium Tire Installation Service</Text>
            <Text style={styles.adSubtitle}>Professional installation with 1-year warranty</Text>
            <Text style={styles.adDescription}>
              Get your tires installed by certified professionals. Fast, reliable, and guaranteed quality service.
            </Text>
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>Book Now →</Text>
            </View>
          </View>
          
          {/* Ad Visual */}
          <View style={styles.visualContent}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🔧</Text>
              <Text style={styles.placeholderSubtext}>Service</Text>
            </View>
          </View>
        </View>

        {/* Ad Footer */}
        <View style={styles.adFooter}>
          <Text style={styles.footerText}>Trusted by 10,000+ customers</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★★★★★</Text>
            <Text style={styles.ratingText}>4.9/5</Text>
          </View>
        </View>
      </View>
      
      {/* Gradient Overlay for Premium Look */}
      <View style={styles.gradientOverlay} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: isMobile ? 16 : 24,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  adContent: {
    padding: isMobile ? 16 : 24,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
    fontFamily: 'Poppins-Bold',
  },
  mainContent: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: isMobile ? 16 : 24,
  },
  textContent: {
    flex: 1,
  },
  adTitle: {
    fontSize: isMobile ? 20 : 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  adSubtitle: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
    color: '#5B7560',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  adDescription: {
    fontSize: isMobile ? 12 : 14,
    color: '#666666',
    lineHeight: isMobile ? 18 : 20,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  ctaContainer: {
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B7560',
    fontFamily: 'Poppins-SemiBold',
  },
  visualContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: isMobile ? 80 : 120,
    height: isMobile ? 80 : 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: isMobile ? 24 : 32,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: isMobile ? 10 : 12,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'linear-gradient(90deg, #5B7560 0%, #7A9A7E 50%, #5B7560 100%)',
  },
});

export default AdBanner; 