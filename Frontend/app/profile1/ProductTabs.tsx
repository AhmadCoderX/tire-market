import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, useWindowDimensions, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserListings, getUserReviews } from "../services/api";
import { TireListing, Review } from "../types";
import ProductCard from "../home1/ProductCard";  // Import the home ProductCard component
import ReviewCard from "./ReviewCard";  // Import the ReviewCard component

interface ProductTabsProps {
  userId: string;
  initialActiveTab?: string | null;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ userId, initialActiveTab = null }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || "published");
  const [listings, setListings] = useState<TireListing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReviewCount, setLoadingReviewCount] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  // Update activeTab when initialActiveTab changes
  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  // Fetch review count on component mount
  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        setLoadingReviewCount(true);
        const token = await AsyncStorage.getItem('accessToken');
        
        // Get user reviews regardless of token status
        const response = await getUserReviews(userId, token || undefined);
        setTotalReviews(response.total_reviews);
        setAverageRating(response.average_rating);
      } catch (err) {
        console.error('Error fetching review count:', err);
      } finally {
        setLoadingReviewCount(false);
      }
    };

    fetchReviewCount();
  }, [userId]);

  // Fetch tab content based on active tab
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem('accessToken');
        
        // Get user listings regardless of token status
        const response = await getUserListings(userId, token || undefined);
        setListings(response.results);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem('accessToken');
        
        // Get user reviews regardless of token status
        const response = await getUserReviews(userId, token || undefined);
        setReviews(response.reviews);
        setTotalReviews(response.total_reviews);
        setAverageRating(response.average_rating);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'published') {
      fetchListings();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [userId, activeTab]);

  const getNumColumns = (width: number) => {
    if (width < 500) return 1;
    if (width < 900) return 2;
    return 3;
  };

  const numColumns = getNumColumns(width);

  // Responsive card width for mobile
  const productCardWidth = width < 500 ? 280 : 320;

  return (
    <View style={styles.container} accessibilityRole="none" accessibilityLabel="Product listings">
      <View style={styles.tabsHeader}>
        <Text
          style={activeTab === "published" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("published")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "published" }}
        >
          Seller's Listings
        </Text>
        <Text
          style={activeTab === "reviews" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("reviews")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "reviews" }}
        >
          Reviews {loadingReviewCount ? "..." : `(${totalReviews})`}
        </Text>
      </View>

      {activeTab === "published" && (
        <View style={styles.productsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#344E41" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : listings.length === 0 ? (
            <Text style={styles.noListingsText}>No listings found</Text>
          ) : (
            <FlatList
              data={listings}
              renderItem={({ item }) => (
                <View style={[styles.productCardContainer, { minWidth: productCardWidth, maxWidth: productCardWidth }]}>
                  <ProductCard listing={item} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              key={`grid-${numColumns}`}
              columnWrapperStyle={numColumns > 1 && styles.productRow}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      )}

      {activeTab === "reviews" && (
        <View style={styles.reviewsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#344E41" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          ) : (
              <FlatList
                data={reviews}
                renderItem={({ item }) => (
                  <ReviewCard
                    reviewerName={item.reviewer.username}
                    rating={item.rating}
                  date={new Date(item.created_at).toLocaleDateString()}
                    reviewText={item.comment}
                    reviewerImage={item.reviewer.profile_image_url}
                  />
                )}
                keyExtractor={(item) => item.id}
              scrollEnabled={true}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  tabsHeader: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "600",
    color: "#344E41",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#344E41",
  },
  inactiveTab: {
    fontSize: 16,
    fontWeight: "400",
    color: "#71717A",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  productsContainer: {
    flex: 1,
  },
  productRow: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 16,
  },
  productCardContainer: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 8,
    height: 520,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  noListingsText: {
    color: "#71717A",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  noReviewsText: {
    color: "#71717A",
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#09090B",
  },
  reviewDate: {
    fontSize: 14,
    color: "#71717A",
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
    color: "#09090B",
    fontWeight: "500",
  },
  reviewText: {
    fontSize: 14,
    color: "#09090B",
    lineHeight: 20,
  },
});

export default ProductTabs;
