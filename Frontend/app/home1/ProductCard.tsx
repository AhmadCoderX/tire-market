import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { TireListing } from "../types";

interface ProductCardProps {
  listing: TireListing;
}

const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Product card clicked, listing ID:', listing.id);
    router.push({
      pathname: "/frame",
      params: { listingId: listing.id }
    });
  };

  const getMainImage = () => {
    const primaryImage = listing.images?.find(img => img.is_primary);
    return primaryImage?.image_url || listing.images?.[0]?.image_url || require("../../assets/images/placeholder.png");
  };

  const formatDimensions = () => {
    return `${listing.width}/${listing.aspect_ratio}/${listing.diameter}`;
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numericPrice) ? numericPrice.toFixed(2) : '0.00';
  };

  const formatTreadDepth = (depth: number | string | undefined) => {
    if (depth === undefined || depth === null) return 'N/A';
    const numericDepth = typeof depth === 'string' ? parseFloat(depth) : depth;
    return !isNaN(numericDepth) ? numericDepth.toFixed(1) : 'N/A';
  };

  const getRating = () => {
    return listing.seller_rating || 0;
  };

  const getReviewCount = () => {
    return listing.seller_review_count || 0;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof getMainImage() === 'string' ? { uri: getMainImage() } : getMainImage()}
          style={styles.image}
          resizeMode="contain"
        />
        {listing.is_promoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>⭐ Promoted</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.price}>${formatPrice(listing.price)}</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>
            {getRating().toFixed(1)} ({getReviewCount()} reviews)
          </Text>
        </View>

        {/* Key Tire Attributes Section */}
        <View style={styles.keyAttributesContainer}>
          <View style={styles.tireSizeContainer}>
            <Text style={styles.tireSizeLabel}>Tire Size</Text>
            <Text style={styles.tireSizeValue}>{formatDimensions()}</Text>
          </View>
          
          <View style={styles.attributesRow}>
            <View style={styles.treadDepthContainer}>
              <Text style={styles.treadDepthLabel}>Tread Depth</Text>
              <Text style={styles.treadDepthValue}>
                {formatTreadDepth(listing.tread_depth)}mm
              </Text>
            </View>
            <View style={[
              styles.conditionBadge,
              listing.condition === 'new' ? styles.newCondition : styles.usedCondition
            ]}>
              <Text style={styles.conditionText}>
                {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.viewDetailsButton,
            listing.is_promoted && styles.promotedButton
          ]} 
          onPress={handlePress}
        >
          <Text style={styles.viewDetailsText}>
            View Details
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
  promotedBadge: {
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
  promotedText: {
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
    fontFamily: "Poppins-SemiBold",
    lineHeight: 22,
    marginRight: 12,
    letterSpacing: 0,
  },
  priceTag: {
    backgroundColor: "#3A593F",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 16,
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
  keyAttributesContainer: {
    backgroundColor: "#F8F9FA",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  tireSizeContainer: {
    marginBottom: 10,
  },
  tireSizeLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tireSizeValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
    letterSpacing: 0.5,
  },
  attributesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  treadDepthContainer: {
    flex: 1,
  },
  treadDepthLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  treadDepthValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B2B2B",
    marginTop: 2,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  newCondition: {
    backgroundColor: "#E8F5E8",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  usedCondition: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2B2B2B",
  },
  viewDetailsButton: {
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
  viewDetailsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  promotedButton: {
    backgroundColor: "#8B4513",
    shadowColor: "#8B4513",
  },
});

export default ProductCard;
