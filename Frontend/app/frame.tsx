import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./header/Header";
import ProductGallery from "./productpage/ProductGallery";
import ProductInfo from "./productpage/ProductInfo";
import QuantitySelector from "./productpage/QuantitySelector";
import ActionButtons from "./productpage/ActionButtons";
import SpecificationsTab from "./productpage/SpecificationsTab";
import SellerInfo from "./productpage/SellerInfo";
import ReviewSection from "./productpage/ReviewSection";
import ReviewForm from "./productpage/ReviewForm";
import { 
  getListingDetails, 
  getUserReviews, 
  createUserReview,
  type TireListing, 
  type ReviewsResponse, 
  API_BASE_URL,
  ensureAbsoluteUrl 
} from "./services/api";

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [listing, setListing] = useState<TireListing | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { listingId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const fetchReviews = async (sellerId: string, token: string) => {
    try {
      console.log('Fetching reviews...');
      const reviewsData = await getUserReviews(sellerId, token);
      console.log('Reviews data received:', reviewsData);
      setReviews(reviewsData);
    } catch (reviewError) {
      console.error('Error fetching reviews:', reviewError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('\n=== Starting Data Fetch ===');
        console.log('Fetching details for listing:', listingId);
        
        const token = await AsyncStorage.getItem('accessToken') || '';
        
        // Fetch listing details
        const listingData = await getListingDetails(listingId as string, token);
        console.log('Listing details received:', JSON.stringify(listingData, null, 2));
        
        // Log image information
        if (listingData.images && listingData.images.length > 0) {
          console.log(`Found ${listingData.images.length} images for this listing:`);
          listingData.images.forEach((img, index) => {
            console.log(`Image ${index + 1}:`);
            console.log(`  ID: ${img.id}`);
            console.log(`  URL: ${img.image_url}`);
            console.log(`  Thumbnail: ${img.thumbnail_url || 'None'}`);
            console.log(`  Is Primary: ${img.is_primary}`);
          });
        } else {
          console.log('No images found for this listing');
        }
        
        // Ensure profile image URL is absolute
        if (listingData.seller && listingData.seller.profile_image_url) {
          listingData.seller.profile_image_url = ensureAbsoluteUrl(listingData.seller.profile_image_url);
        }
        
        setListing(listingData);

        // Construct and log reviews URL
        if (listingData && listingData.seller) {
          const sellerId = typeof listingData.seller === 'string' ? listingData.seller : listingData.seller.id;
          const reviewsUrl = `${API_BASE_URL}/users/${sellerId}/reviews/`;
          
          console.log('\n=== Reviews URL Construction ===');
          console.log('Base URL:', API_BASE_URL);
          console.log('Seller ID:', sellerId);
          console.log('Complete URL:', reviewsUrl);
          console.log('===============================\n');

          await fetchReviews(sellerId, token);
        } else {
          console.warn('No seller data available in listing:', listingData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (listingId) {
      fetchData();
    }
  }, [listingId]);

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Please login to submit a review');
      }

      if (!listing?.seller) {
        throw new Error('Seller information not available');
      }

      const sellerId = typeof listing.seller === 'string' ? listing.seller : listing.seller.id;
      
      console.log('Submitting review:', {
        sellerId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      // Create the review
      await createUserReview(sellerId, token, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      // Immediately fetch updated reviews to refresh the UI
      await fetchReviews(sellerId, token);
      
      setShowReviewForm(false);
      Alert.alert('Success', 'Review submitted successfully');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error.message || 'Failed to submit review');
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSearch = (query: string, sellerType: string) => {
    // Handle search in product detail page if needed
    console.log('Search:', query, sellerType);
  };

  const handleProfilePress = () => {
    // Handle profile press in product detail page if needed
    console.log('Profile pressed');
  };

  const handleSellerPress = () => {
    if (listing?.seller) {
      const sellerId = typeof listing.seller === 'string' ? listing.seller : listing.seller.id;
      console.log("Navigating to seller profile with ID:", sellerId);
      router.push(`/profileDetails?sellerId=${sellerId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header onSearch={handleSearch} onProfilePress={handleProfilePress} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.mainContent,
          isMobile && styles.mainContentMobile
        ]}>
          <View style={[
            styles.galleryContainer,
            isMobile && styles.galleryContainerMobile
          ]}>
            <ProductGallery images={listing?.images} />
          </View>
          <View style={[
            styles.productDetails,
            isMobile && styles.productDetailsMobile
          ]}>
            <ProductInfo
              title={listing?.title || "Loading..."}
              rating={reviews?.average_rating || 0}
              reviewCount={reviews?.total_reviews || 0}
              currentPrice={listing ? `$${parseFloat(listing.price.toString()).toFixed(2)}` : "Loading..."}
              originalPrice="$999.99"
            />
            <View style={styles.quantityContainer}>
              <QuantitySelector
                quantity={quantity}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
              />
            </View>
            <ActionButtons 
              sellerId={typeof listing?.seller === 'string' ? listing.seller : listing?.seller?.id}
              sellerName={listing?.seller_name || (listing?.seller?.username || '')}
              listingId={listing?.id}
              listingTitle={listing?.title}
              listingPrice={listing ? `$${parseFloat(listing.price.toString()).toFixed(2)}` : undefined}
              listingImage={listing?.images && listing.images.length > 0 ? listing.images[0].image_url : undefined}
            />
            <SpecificationsTab listing={listing} />
            <SellerInfo
              name={listing?.seller_name || "Loading..."}
              memberSince="3/15/2021"
              type="Individual"
              profileImage={listing?.seller?.profile_image_url}
              onPress={handleSellerPress}
            />
          </View>
        </View>
        
        <View style={[
          styles.reviewsSection,
          isMobile && styles.reviewsSectionMobile
        ]}>
          <ReviewSection 
            rating={reviews?.average_rating || 0}
            reviewCount={reviews?.total_reviews || 0}
            reviews={reviews?.reviews.map(review => ({
              id: review.id,
              userName: review.reviewer.username,
              rating: review.rating,
              date: review.created_at.split('T')[0],
              comment: review.comment || '',
              profileImage: review.reviewer.profile_image_url
            })) || []}
            onWriteReview={() => setShowReviewForm(true)}
          />
        </View>
      </ScrollView>

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    flexDirection: "row",
    padding: 40,
    gap: 24,
    flexWrap: "wrap",
    marginBottom: 80,
  },
  mainContentMobile: {
    flexDirection: "column",
    padding: 16,
    gap: 0,
    marginBottom: 60,
  },
  galleryContainer: {
    flex: 1,
    minWidth: 300,
  },
  galleryContainerMobile: {
    width: "100%",
    marginBottom: 0,
  },
  productDetails: {
    flex: 1,
    minWidth: 300,
  },
  productDetailsMobile: {
    width: "100%",
    marginTop: 2,
  },
  reviewsSection: {
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 0,
  },
  reviewsSectionMobile: {
    padding: 16,
    marginTop: 80,
    maxWidth: "100%",
  },
  quantityContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
});

export default ProductDetailScreen;
