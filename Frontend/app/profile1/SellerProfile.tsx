import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import TabSelector from "../listing/TabSelector";
import EditProfileModal from "./EditProfileModal";
import { useProfile } from "../hooks/useProfile";
import { updateProfile } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BusinessHoursDisplay from "./BusinessHoursDisplay";

interface SellerProfileProps {
  userData?: any; // This will be used when viewing another user's profile
  onMessagePress?: () => void; // New prop to handle message button press from parent
  isCurrentUserProfile?: boolean; // Flag to indicate if this is the current user's profile
}

const SellerProfile: React.FC<SellerProfileProps> = ({ 
  userData, 
  onMessagePress,
  isCurrentUserProfile = false
}) => {
  const [activeTab, setActiveTab] = useState("services");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const router = useRouter();
  const { profileData: ownProfileData, loading, error, refreshProfile } = useProfile();
  
  // Use the userData prop if provided, otherwise use the profile data from the hook
  const profileData = userData || ownProfileData;
  // If isCurrentUserProfile prop is provided, use it, otherwise determine based on userData
  const isCurrentUser = isCurrentUserProfile || !userData;
  
  const isBusinessUser = profileData?.is_business || false;
  const totalReviews = profileData?.total_reviews || 0;

  // Format business hours from the backend data
  const formatBusinessHours = () => {
    // Early return if no business hours data
    if (!profileData?.business_hours) {
      console.log("No business hours found in profile data");
      return "No business hours provided";
    }
    
    try {
      console.log("Raw business_hours:", JSON.stringify(profileData.business_hours));
      
      // The business_hours object
      const businessHours = profileData.business_hours;
      
      // The days in the order we want to display them
      const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      let formattedHours = "";
      
      // Check if each day exists and format accordingly
      for (const day of orderedDays) {
        const dayData = businessHours[day];
        
        if (!dayData) {
          formattedHours += `${day}: Not Available\n`;
          continue;
        }
        
        if (dayData.isOpen === false) {
          formattedHours += `${day}: Closed\n`;
        } else {
          formattedHours += `${day}: ${dayData.from} - ${dayData.to}\n`;
        }
      }
      
      return formattedHours.trim();
    } catch (err) {
      console.error('Error formatting business hours:', err);
      console.log('Business hours data:', typeof profileData.business_hours, 
                  JSON.stringify(profileData.business_hours));
      return "Error displaying business hours";
    }
  };

  const businessHoursText = formatBusinessHours();

  const tabOptions = [
    { id: "services", label: "Services" },
    { id: "businessHours", label: "Business Hours" },
  ];

  const handleEditSave = async (data: any) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // Prepare the data for the API
      const updateData = {
        username: data.name,
        email: data.email,
        phone: data.phone,
        profile_image_url: data.profile_image_url // Use the profile_image_url from the data
      };

      // Send update to backend
      await updateProfile(token, updateData);
      
      // Refresh profile data
      await refreshProfile();
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditModalVisible(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleMessagePress = async () => {
    if (onMessagePress) {
      // If parent component provides a handler, use it
      onMessagePress();
    } else if (profileData?.id) {
      try {
        // Check if user is logged in
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert(
            "Login Required", 
            "You need to login to message this user.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Login", 
                onPress: () => router.push({
                  pathname: "/login",
                  params: { returnToProfile: 'true' }
                })
              }
            ]
          );
          return;
        }

        // Navigate to chat with the seller ID
        router.push({
          pathname: "/chat",
          params: { 
            sellerId: profileData.id,
            sellerName: profileData.username 
          }
        });
      } catch (error) {
        console.error("Error handling message press:", error);
      }
    }
  };

  const renderServiceTags = () => {
    // Check if this is a business user profile
    if (!isBusinessUser) {
      return (
        <View style={styles.noBusinessContainer}>
          <Text style={styles.noBusinessText}>This user is not a business user.</Text>
        </View>
      );
    }

    // Get services from profileData
    const services = profileData?.services || [];

    if (!Array.isArray(services) || services.length === 0) {
      return (
        <View style={styles.noBusinessContainer}>
          <Text style={styles.noBusinessText}>No services listed.</Text>
        </View>
      );
    }

    return (
      <View style={styles.tagsContainer}>
        {services.map((service: string, index: number) => (
          <View key={index} style={styles.tagItem}>
            <Text style={styles.tagText}>{service}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading && !userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5B7560" />
      </View>
    );
  }

  if (error && !userData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel="Seller Profile"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ 
                uri: profileData?.profile_image_url || 'https://via.placeholder.com/72',
                cache: 'reload'
              }}
              style={styles.profileImage} 
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName} accessibilityRole="header">
                {profileData?.username || 'Loading...'}
              </Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  <Image
                    source={{
                      uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e8d529db7767f094fa39e175f33e238ff018befe3eb38d6d423770c33a75743?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                    }}
                    style={styles.starIcon}
                    accessibilityLabel="Star icon"
                  />
                  <Text style={styles.ratingValue}>{profileData?.rating || '0.0'}</Text>
                </View>
                <Text style={styles.reviewCount}>({totalReviews} reviews)</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {!isCurrentUser ? (
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessagePress}
              accessibilityRole="button"
              accessibilityLabel="Message seller"
            >
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/a1c2c0a0d6f1f44d7575e3be7cc5696a63c5838c0bc9b9c21e23a66856095a8e?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                }}
                style={styles.messageIcon}
                accessibilityLabel="Message icon"
              />
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabsSection}>
          <TabSelector
            options={tabOptions}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "services" && (
            <View style={styles.servicesContainer}>
              <View style={styles.serviceSection}>{renderServiceTags()}</View>
            </View>
          )}

          {activeTab === "businessHours" && (
            <View style={styles.businessHoursContainer}>
              {isBusinessUser ? (
                <BusinessHoursDisplay businessHours={profileData?.business_hours || null} />
              ) : (
                <View style={styles.noBusinessContainer}>
                  <Text style={styles.noBusinessText}>This user is not a business user.</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {isCurrentUser && (
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialData={{
          name: profileData?.username || '',
          email: profileData?.email || '',
          phone: profileData?.phone || '',
          address: profileData?.shop_address || '',
            shopName: profileData?.shop_name || '',
            shopAddress: profileData?.shop_address || '',
            businessHours: businessHoursText,
          profileImage: profileData?.profile_image_url || 'https://via.placeholder.com/72'
        }}
        onSave={handleEditSave}
          onFieldChange={() => {}}
        isBusinessUser={isBusinessUser}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#F5F5F5",
    padding: 16,
    width: "100%",
    maxWidth: "100%",
  },
  content: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    flexWrap: "wrap",
    gap: 16,
  },
  profileInfo: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    flex: 1,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E0E0",
  },
  profileDetails: {
    flex: 1,
    minWidth: 180,
  },
  profileName: {
    color: "#2B2B2B",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.5,
    fontFamily: "Arial",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    fontSize: 16,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    color: "#09090B",
    fontWeight: "700",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  ratingValue: {
    fontFamily: "Arial",
    fontWeight: "700",
    fontSize: 16,
    color: "#09090B",
  },
  reviewCount: {
    color: "#344E41",
    fontWeight: "400",
    fontFamily: "Arial",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  messageButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5B7560",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  messageIcon: {
    width: 16,
    height: 16,
  },
  messageText: {
    color: "#E6E6E6",
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5B7560",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: "white",
  },
  editText: {
    color: "#E6E6E6",
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  tabsSection: {
    marginTop: 24,
    width: "100%",
  },
  servicesContainer: {
    marginTop: 16,
  },
  serviceSection: {
    marginTop: 8,
    width: "100%",
    color: "#3A593F",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  tagItem: {
    borderRadius: 9999,
    backgroundColor: "#EBEEEC",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: "#3A593F",
    fontSize: 12,
    fontFamily: "Arial",
    fontWeight: "500",
  },
  businessHoursContainer: {
    marginTop: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noBusinessContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBusinessText: {
    color: '#666',
    fontSize: 14,
    fontFamily: "Arial",
    textAlign: 'center',
  },
});

export default SellerProfile;
