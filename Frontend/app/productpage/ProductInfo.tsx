import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { StarIcon, ShareIcon } from "./Icons";

interface ProductInfoProps {
  title: string;
  rating: number;
  reviewCount: number;
  currentPrice: string;
  originalPrice: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  rating,
  reviewCount,
  currentPrice,
  originalPrice,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          isMobile && styles.titleMobile
        ]} accessibilityRole="header">
          {title}
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          accessibilityLabel="Share product"
        >
          <ShareIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.rating}>
        <StarIcon />
        <Text style={styles.ratingScore}>{rating}</Text>
        <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
      </View>

      <View style={styles.priceSection}>
        <Text style={[
          styles.currentPrice,
          isMobile && styles.currentPriceMobile
        ]}>{currentPrice}</Text>
        <Text style={[
          styles.originalPrice,
          isMobile && styles.originalPriceMobile
        ]}>{originalPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  titleMobile: {
    fontSize: 22,
  },
  shareButton: {
    padding: 12,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  ratingScore: {
    color: "#344E41",
    fontSize: 14,
    fontWeight: "500",
  },
  reviewCount: {
    color: "#344E41",
    fontSize: 14,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  currentPrice: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
  },
  currentPriceMobile: {
    fontSize: 24,
  },
  originalPrice: {
    fontSize: 18,
    color: "#344E41",
    textDecorationLine: "line-through",
  },
  originalPriceMobile: {
    fontSize: 16,
  },
});

export default ProductInfo;
