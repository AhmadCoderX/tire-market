import * as React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import TabSelector from "./TabSelector";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";

interface Product {
  id: string;
  title: string;
  price: string;
  postDate: string;
  brand: string;
  model: string;
  condition: string;
  quantity: string;
  imageUrl: string;
  isPromoted: boolean;
}

const PublishedAds: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("publishedAds");

  const tabOptions = [
    { id: "publishedAds", label: "Published Ads" },
    { id: "reviews", label: "Reviews" },
  ];

  // Sample product data
  const products: Product[] = [
    {
      id: "1",
      title: "Continental ExtremeContact DWS06 Plus",
      price: "$720.00",
      postDate: "Posted: 1/15/2024",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      condition: "New",
      quantity: "4",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f2a44624494390ad8427b4bb8a26cf81fa15696977fb328485fa86c404400a38?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      isPromoted: true,
    },
    {
      id: "2",
      title: "Continental ExtremeContact DWS06 Plus",
      price: "$720.00",
      postDate: "Posted: 1/15/2024",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      condition: "New",
      quantity: "4",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f2a44624494390ad8427b4bb8a26cf81fa15696977fb328485fa86c404400a38?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      isPromoted: true,
    },
    {
      id: "3",
      title: "Continental ExtremeContact DWS06 Plus",
      price: "$720.00",
      postDate: "Posted: 1/15/2024",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      condition: "New",
      quantity: "4",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f2a44624494390ad8427b4bb8a26cf81fa15696977fb328485fa86c404400a38?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      isPromoted: false,
    },
    {
      id: "4",
      title: "Continental ExtremeContact DWS06 Plus",
      price: "$720.00",
      postDate: "Posted: 1/15/2024",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      condition: "New",
      quantity: "4",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f2a44624494390ad8427b4bb8a26cf81fa15696977fb328485fa86c404400a38?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      isPromoted: false,
    },
    {
      id: "5",
      title: "Continental ExtremeContact DWS06 Plus",
      price: "$720.00",
      postDate: "Posted: 1/15/2024",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      condition: "New",
      quantity: "4",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/ad125c4ddb17b214f19b5a8fcc0d60a455d85ee53abcb39ac61c7aa82f169e59?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
      isPromoted: false,
    },
  ];

  // Sample reviews data
  const reviews = [
    {
      id: "1",
      reviewerName: "John Smith",
      rating: 5,
      date: "Jan 10, 2024",
      reviewText:
        "Great service and quality products! I purchased a set of Continental tires and they've been performing excellently. The staff was knowledgeable and helped me choose the right tires for my vehicle and driving conditions.",
    },
    {
      id: "2",
      reviewerName: "Sarah Johnson",
      rating: 4,
      date: "Dec 15, 2023",
      reviewText:
        "Very satisfied with my purchase. The tires were installed quickly and professionally. The only reason I'm not giving 5 stars is because I had to wait a bit longer than expected for my appointment.",
    },
    {
      id: "3",
      reviewerName: "Michael Brown",
      rating: 5,
      date: "Nov 28, 2023",
      reviewText:
        "TireMax Pro Shop has the best prices in town! I compared with several other shops and they beat everyone's prices while still offering premium brands. Will definitely be coming back for my next set.",
    },
    {
      id: "4",
      reviewerName: "Emily Davis",
      rating: 3,
      date: "Oct 5, 2023",
      reviewText:
        "The tires are good quality, but the customer service could be improved. Had to follow up multiple times about my order status.",
    },
  ];

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      title={item.title}
      price={item.price}
      postDate={item.postDate}
      brand={item.brand}
      model={item.model}
      condition={item.condition}
      quantity={item.quantity}
      imageUrl={item.imageUrl}
      isPromoted={item.isPromoted}
    />
  );

  const renderReviewItem = ({ item }: { item: { id: string; reviewerName: string; rating: number; date: string; reviewText: string; } }) => (
    <ReviewCard
      reviewerName={item.reviewerName}
      rating={item.rating}
      date={item.date}
      reviewText={item.reviewText}
    />
  );

  const renderReviewsContent = () => (
    <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>Customer Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel="Published Advertisements"
    >
      <TabSelector
        options={tabOptions}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "publishedAds" ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      ) : (
        renderReviewsContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    width: "100%",
  },
  productsList: {
    width: "100%",
  },
  reviewsContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },
  reviewsTitle: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 18,
    fontWeight: "600",
    color: "#2B2B2B",
    marginBottom: 16,
  },
});

export default PublishedAds;
