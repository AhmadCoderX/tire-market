import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import StarRating from "./StarRating";

interface ProductDetailsProps {
  title: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  title,
  rating,
  reviewCount,
  price,
  originalPrice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          accessibilityRole="button"
          accessibilityLabel="Add to favorites"
        >
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/38e2409adde5da321afa0df582da89e31227dffd96a67a95d05881107257e191?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
            }}
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/85177fa71d4566620130d2c2513c2e2fb0bcb097c47bdc95f2a0dadd27164f23?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
          }}
          style={styles.starIcon}
        />
        <Text style={styles.ratingText}>{rating}</Text>
        <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        {originalPrice && (
          <Text style={styles.originalPrice}>{originalPrice}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontFamily: "Arial",
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    lineHeight: 36,
    flex: 1,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    width: 16,
    height: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    color: "#344E41",
    width: 22,
  },
  reviewCount: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    color: "#344E41",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 7,
  },
  price: {
    fontFamily: "Inter",
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    lineHeight: 36,
  },
  originalPrice: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "400",
    color: "#344E41",
    textDecorationLine: "line-through",
  },
});

export default ProductDetails;
