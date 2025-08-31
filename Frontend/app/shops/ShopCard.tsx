import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Shop {
  id: string;
  user_id: string;
  name: string;
  business_type: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  services: string[];
  operating_hours: any; // Can be string or object format
  image_url?: string | null;
  is_featured?: boolean;
}

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Shop card clicked, shop ID:', shop.id, 'user ID:', shop.user_id);
    // Navigate to seller's profile page
    router.push({
      pathname: "/profileDetails",
      params: { sellerId: shop.user_id }
    });
  };

  const getShopImage = () => {
    return shop.image_url || require("../../assets/images/placeholder.png");
  };

  const getMainServices = () => {
    // Show max 4 services for better visual balance
    return shop.services?.slice(0, 4) || [];
  };

  const formatBusinessType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for better readability
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatOperatingHours = (hours: any) => {
    // Handle if hours is already a string (formatted schedule)
    if (typeof hours === 'string') {
      // If it's a detailed schedule string, try to extract today's info
      if (hours.includes('\n')) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const lines = hours.split('\n');
        const todayLine = lines.find(line => line.startsWith(today));
        
        if (todayLine) {
          const match = todayLine.match(/:\s*(.+)/);
          if (match) {
            const timeRange = match[1].trim();
            // Parse the time range and determine if open now
            if (timeRange.toLowerCase().includes('closed')) {
              return 'Closed today';
            }
            return `Open • ${timeRange}`;
          }
        }
      }
      return hours; // Return as-is if it's a simple string
    }
    
    // Handle if hours is an object (from backend)
    if (typeof hours === 'object' && hours !== null) {
      try {
        // Helper function to normalize time format (already formatted times from backend)
        const normalizeTime = (time: string) => {
          if (!time) return '';
          // Handle already formatted times like "09:00AM", "5:30 PM"
          return time.replace(/\s+/g, '').toUpperCase(); // Remove spaces and standardize
        };

        // Get all days and their hours
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        // Get today's status first for immediate relevance
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        // Try both lowercase and title case versions of the day name
        const todayHours = hours[today] || hours[today.toLowerCase()];
        
        if (todayHours) {
          if (!todayHours.isOpen) {
            return 'Closed today';
          }
          
          // Check for invalid data (same from/to times)
          const fromTime = normalizeTime(todayHours.from);
          const toTime = normalizeTime(todayHours.to);
          
          if (fromTime === toTime) {
            return 'Hours available';
          }
          
          // Show today's hours
          return `Open • ${todayHours.from} - ${todayHours.to}`;
        }
        
        // If no today info, try to find a pattern for general display
        const openDays = dayNames.filter(day => {
          // Try both lowercase and title case versions
          const dayInfo = hours[day] || hours[day.toLowerCase()];
          return dayInfo && dayInfo.isOpen && dayInfo.from !== dayInfo.to;
        });
        
        if (openDays.length === 0) {
          return 'Closed';
        }
        
        // Check if weekdays have a consistent pattern
        const weekdayInfo = weekdays.map(day => {
          // Try both lowercase and title case versions
          return hours[day] || hours[day.toLowerCase()];
        }).filter(dayInfo => 
          dayInfo && dayInfo.isOpen && dayInfo.from !== dayInfo.to
        );
        
        if (weekdayInfo.length > 0) {
          const firstWeekday = weekdayInfo[0];
          const consistentWeekdays = weekdayInfo.every(dayInfo => 
            dayInfo.from === firstWeekday.from && dayInfo.to === firstWeekday.to
          );
          
          if (consistentWeekdays && weekdayInfo.length >= 3) {
            return `Mon-Fri ${firstWeekday.from} - ${firstWeekday.to}`;
          }
        }
        
        // Fallback to first open day's hours
        const firstOpenDay = openDays[0];
        // Try both lowercase and title case versions
        const firstDayInfo = hours[firstOpenDay] || hours[firstOpenDay.toLowerCase()];
        return `${firstDayInfo.from} - ${firstDayInfo.to}`;
        
      } catch (error) {
        console.error('Error formatting hours:', error);
        return 'Hours available';
      }
    }
    
    // Fallback for any other case
    return 'Hours available';
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof getShopImage() === 'string' ? { uri: getShopImage() } : getShopImage()}
          style={styles.image}
          resizeMode="cover"
        />
        {shop.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{shop.name}</Text>
          <View style={styles.businessTypeTag}>
            <Text style={styles.businessTypeText}>{formatBusinessType(shop.business_type)}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>
            {shop.rating.toFixed(1)} ({shop.review_count} reviews)
          </Text>
        </View>

        {/* Location and Contact Section */}
        <View style={styles.locationContactContainer}>
          <View style={styles.locationRow}>
            <MaterialIcons name="place" size={16} color="#666666" />
            <Text style={styles.locationText}>{shop.address}</Text>
          </View>
          {shop.phone && (
            <View style={styles.phoneRow}>
              <MaterialIcons name="phone" size={16} color="#666666" />
              <Text style={styles.phoneText}>{formatPhoneNumber(shop.phone)}</Text>
            </View>
          )}
        </View>

        {/* Services Tags Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesLabel}>Services</Text>
          <View style={styles.servicesTagsContainer}>
            {getMainServices().map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>{service}</Text>
              </View>
            ))}
            {shop.services && shop.services.length > 4 && (
              <View style={[styles.serviceTag, styles.moreServicesTag]}>
                <Text style={[styles.serviceTagText, styles.moreServicesText]}>
                  +{shop.services.length - 4} more
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Operating Hours */}
        <View style={styles.hoursSection}>
          <View style={styles.hoursRow}>
            <MaterialIcons name="access-time" size={16} color="#588157" />
            <Text style={styles.hoursText}>{formatOperatingHours(shop.operating_hours)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.contactButton,
            shop.is_featured && styles.featuredButton
          ]} 
          onPress={handlePress}
        >
          <Text style={styles.contactButtonText}>
            View Shop Details
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 200,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#8B4513",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  featuredText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#2B2B2B",
    fontFamily: "Inter",
    lineHeight: 22,
    marginRight: 12,
    letterSpacing: 0,
  },
  businessTypeTag: {
    backgroundColor: "#3A593F",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  businessTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    color: "#FACC15",
    fontSize: 18,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  locationContactContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#2B2B2B",
    marginLeft: 8,
    fontWeight: "500",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneText: {
    fontSize: 14,
    color: "#3A593F",
    marginLeft: 8,
    fontWeight: "500",
  },
  servicesSection: {
    marginBottom: 12,
    minHeight: 100,
  },
  servicesLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  servicesTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  serviceTag: {
    backgroundColor: "#E8F5E8",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  serviceTagText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  moreServicesTag: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  moreServicesText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  hoursSection: {
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursText: {
    fontSize: 14,
    color: "#3A593F",
    marginLeft: 8,
    fontWeight: "600",
  },
  contactButton: {
    backgroundColor: "#3A593F",
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    marginTop: 8,
    shadowColor: "#3A593F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  featuredButton: {
    backgroundColor: "#8B4513",
    shadowColor: "#8B4513",
  },
});

export default ShopCard; 