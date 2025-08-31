import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "./Header";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import QuantitySelector from "./QuantitySelector";
import ActionButtons from "./ActionButtons";
import SpecificationsTab from "./SpecificationsTab";
import SellerInfo from "./SellerInfo";
import ReviewSection from "./ReviewSection";

interface ListingData {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'used';
  tire_type: string;
  width: number;
  aspect_ratio: number;
  diameter: number;
  load_index: number;
  speed_rating: string;
  tread_depth: number;
  brand: string;
  quantity: number;
  mileage?: number;
  seller_name: string;
  seller_rating: number;
  images: any[];
  model: string;
}

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Debug log for initial render
  console.log('ProductDetailScreen mounted');
  console.log('Raw params:', params);
  
  const listingId = params.listingId as string;
  console.log('Extracted listingId:', listingId); // Debug log
  
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchListingData = async () => {
      console.log('Starting to fetch data for listingId:', listingId);
      if (!listingId) {
        console.log('No listingId found in params');
        return;
      }
      
      try {
                        console.log('Making API request to:', `http://localhost:8000/api/listings/${listingId}/`);
            const response = await fetch(`http://localhost:8000/api/listings/${listingId}/`);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch listing data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        setListingData(data);
      } catch (error) {
        console.error('Error fetching listing data:', error);
      }
    };

    fetchListingData();
  }, [listingId]);

  // Debug log for render updates
  useEffect(() => {
    console.log('listingData updated:', listingData);
  }, [listingData]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <ProductGallery />
          <View style={styles.productDetails}>
            <ProductInfo
              title={listingData?.title || 'Loading...'}
              rating={4.8}
              reviewCount={156}
              currentPrice={listingData ? `$${listingData.price}` : 'Loading...'}
              originalPrice="$999.99"
            />
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
            />
            <ActionButtons />
            <SpecificationsTab />
            <SellerInfo
              name="TireMax Pro Shop"
              memberSince="3/15/2021"
              type="Business"
            />
          </View>
        </View>
        
        <View style={styles.reviewsSection}>
          <ReviewSection 
            rating={4.8}
            reviewCount={156}
            reviews={[
              {
                id: '1',
                userName: 'John Doe',
                rating: 5,
                date: '2024-02-15',
                comment: "Great tires! They've significantly improved my car's handling and performance.",
              },
              {
                id: '2',
                userName: 'Jane Smith',
                rating: 4,
                date: '2024-02-10',
                comment: 'Good quality tires for the price. Shipping was fast and they were easy to install.',
              },
              {
                id: '3',
                userName: 'Mike Johnson',
                rating: 5,
                date: '2024-02-05',
                comment: 'Excellent tread life and performance in wet conditions. Highly recommended!',
              },
            ]}
          />
        </View>
      </ScrollView>
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
    gap: 32,
    flexWrap: "wrap",
  },
  productDetails: {
    flex: 1,
    minWidth: 300,
  },
  reviewsSection: {
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});

export default ProductDetailScreen;
