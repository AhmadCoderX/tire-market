import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./header/Header";
import SellerProfile from "./profile1/SellerProfile";
import ContactDetails from "./profile1/ContactDetails";
import ProductTabs from "./profile1/ProductTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, getSellerProfile, API_BASE_URL, ensureAbsoluteUrl } from "./services/api";

const ProfileDetails: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWebView = width >= 768;
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sellerId, userId: urlUserId } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const productTabsRef = useRef<View | null>(null);
  const [initialActiveTab, setInitialActiveTab] = useState<string | null>(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        // Get current user data to check if we're viewing our own profile
        const currentUserData = await AsyncStorage.getItem('userData');
        let currentUserId = null;
        if (currentUserData) {
          const parsedUserData = JSON.parse(currentUserData);
          currentUserId = parsedUserData.id;
        }
        
        // Use either sellerId or userId from URL parameters
        const targetUserId = sellerId || urlUserId || null;
        console.log("Profile Details - Fetching data for user:", targetUserId);
        console.log("Current user ID:", currentUserId);
        
        // Check if viewing own profile
        const isOwnProfile = (!targetUserId || (targetUserId === currentUserId));
        setIsCurrentUserProfile(isOwnProfile);
        
        // If a user ID is provided in the URL, fetch that specific user's profile
        if (targetUserId) {
          // Try to fetch the complete seller profile first
          try {
            console.log("Attempting to fetch complete profile for user:", targetUserId);
            const sellerProfileData = await getSellerProfile(targetUserId as string, token || undefined);
            console.log("Complete user profile data received:", sellerProfileData);
            
            // Fetch the user's reviews to add to the profile data
            try {
              const reviewsResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/reviews/`, {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                  'Content-Type': 'application/json'
                }
              });
              
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                
                // Add review data to seller data
                sellerProfileData.total_reviews = reviewsData.total_reviews || 0;
                sellerProfileData.rating = reviewsData.average_rating || sellerProfileData.rating || 0;
              }
            } catch (reviewError) {
              console.error("Error fetching reviews:", reviewError);
            }
            
            setProfileData(sellerProfileData);
            setUserId(targetUserId as string);
            setLoading(false);
            return;
          } catch (profileError) {
            console.error("Error fetching complete seller profile:", profileError);
            // Continue with fallback approach
          }
          
          // Approach 1: We can fetch user listings to get their profile details
          const listingsResponse = await fetch(`${API_BASE_URL}/listings/?seller=${targetUserId}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          });
          
          if (!listingsResponse.ok) {
            console.error("Failed to fetch seller listings:", listingsResponse.status);
            throw new Error('Failed to fetch seller profile');
          }
          
          // Get information about the seller from their listings
          const listingsData = await listingsResponse.json();
          console.log("Seller listings data received, count:", listingsData.count);
          
          if (listingsData.results && listingsData.results.length > 0) {
            // All listings will have the same seller, so we can get seller data from the first listing
            const firstListing = listingsData.results[0];
            let sellerData;
            
            if (typeof firstListing.seller === 'string') {
              sellerData = {
                id: firstListing.seller,
                username: firstListing.seller_name,
                rating: firstListing.seller_rating || 0
              };
            } else {
              sellerData = firstListing.seller;
            }
            
            // Fetch the seller's reviews to add to the profile data
            try {
              const reviewsResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/reviews/`, {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                  'Content-Type': 'application/json'
                }
              });
              
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                console.log("Reviews data:", JSON.stringify(reviewsData, null, 2));
                
                // Add review data to seller data
                sellerData.total_reviews = reviewsData.total_reviews || 0;
                sellerData.rating = reviewsData.average_rating || sellerData.rating || 0;
              }
            } catch (reviewError) {
              console.error("Error fetching reviews:", reviewError);
            }
            
            // Ensure profile image URL is absolute
            if (sellerData.profile_image_url) {
              sellerData.profile_image_url = ensureAbsoluteUrl(sellerData.profile_image_url);
            }
            
            console.log("Final seller data:", JSON.stringify(sellerData, null, 2));
            setProfileData(sellerData);
            setUserId(targetUserId as string);
          } else {
            // No listings found, but we can still try to get basic info
            // Let's fetch the reviews which might give us the username
            try {
              const reviewsResponse = await fetch(`${API_BASE_URL}/users/${targetUserId}/reviews/`, {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                  'Content-Type': 'application/json'
                }
              });
              
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                
                // Create basic seller data
                const sellerData: any = {
                  id: targetUserId,
                  username: "Seller", // Default name if we can't get it
                  rating: reviewsData.average_rating || 0,
                  total_reviews: reviewsData.total_reviews || 0
                };
                
                // If there are reviews, we can get the username from the first review
                if (reviewsData.reviews && reviewsData.reviews.length > 0 && 
                    reviewsData.reviews[0].reviewed_user && 
                    reviewsData.reviews[0].reviewed_user.username) {
                  sellerData.username = reviewsData.reviews[0].reviewed_user.username;
                  
                  if (reviewsData.reviews[0].reviewed_user.profile_image_url) {
                    sellerData.profile_image_url = ensureAbsoluteUrl(
                      reviewsData.reviews[0].reviewed_user.profile_image_url
                    );
                  }
                }
                
                console.log("Basic seller data from reviews:", JSON.stringify(sellerData, null, 2));
                setProfileData(sellerData);
                setUserId(targetUserId as string);
              } else {
                throw new Error('No seller information found');
              }
            } catch (error) {
              console.error("Error getting seller from reviews:", error);
              throw new Error('No seller information found');
            }
          }
        } else {
          // If no user ID provided, load the current user's profile
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUserId(parsedUserData.id);
            
            // Fetch the complete profile data
            if (token) {
              const profileData = await getUserProfile(token);
              setProfileData(profileData);
            } else {
              setProfileData(parsedUserData);
            }
        } else {
          setError('User data not found');
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [sellerId, urlUserId]);

  // Handle scrolling to the appropriate section if requested
  useEffect(() => {
    if (loading) return;

    const checkScrollTarget = async () => {
      try {
        const scrollTarget = await AsyncStorage.getItem('profileDetailsScrollTarget');
        const activeTab = await AsyncStorage.getItem('profileDetailsActiveTab');
        
        if (activeTab) {
          setInitialActiveTab(activeTab);
          await AsyncStorage.removeItem('profileDetailsActiveTab');
        }
        
        if (scrollTarget) {
          console.log("Found scroll target:", scrollTarget);
          
          // Clear the scroll target from AsyncStorage
          await AsyncStorage.removeItem('profileDetailsScrollTarget');
          
          // Give time for the component to fully render
          setTimeout(() => {
            if (productTabsRef.current && scrollViewRef.current) {
              // Measure the position of the ProductTabs component
              productTabsRef.current.measureInWindow((x, y, width, height) => {
                if (scrollViewRef.current) {
                  // Scroll to the ProductTabs component
                  scrollViewRef.current.scrollTo({
                    y: y - 100, // Subtracting some offset to show more context
                    animated: true
                  });
                  console.log(`Scrolled to ${scrollTarget}`);
                }
              });
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error handling scroll target:", error);
      }
    };

    checkScrollTarget();
  }, [loading]);

  const handleMessagePress = async () => {
    if (!userId) {
      console.error("No user ID available for messaging");
      return;
    }

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
          sellerId: userId,
          sellerName: profileData?.username || "Seller"
        }
      });
    } catch (error) {
      console.error("Error handling message press:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#344E41" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Please log in to view profile'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView 
        style={styles.scrollView} 
        ref={scrollViewRef}
      >
        <View style={styles.content}>
          <Header onSearch={() => {}} />
          
          <View style={styles.mainContent}>
            <View style={[styles.profileSection, isWebView && styles.profileSectionWeb]}>
              <View style={[styles.profileContainer, isWebView && styles.profileContainerWeb]}>
                <SellerProfile userData={profileData} onMessagePress={handleMessagePress} isCurrentUserProfile={isCurrentUserProfile} />
              </View>
              <View style={[styles.contactContainer, isWebView && styles.contactContainerWeb]}>
                <ContactDetails userData={profileData} />
              </View>
            </View>
            <View 
              ref={productTabsRef}
              collapsable={false}
            >
              <ProductTabs userId={userId} initialActiveTab={initialActiveTab} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingBottom: 50,
  },
  mainContent: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1188,
    paddingHorizontal: 16,
    marginTop: 54,
  },
  profileSection: {
    width: '100%',
    marginBottom: 24,
  },
  profileSectionWeb: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-start',
  },
  profileContainer: {
    width: '100%',
  },
  profileContainerWeb: {
    width: '65%',
  },
  contactContainer: {
    width: '100%',
    marginTop: 16,
  },
  contactContainerWeb: {
    width: '35%',
    marginTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileDetails;
