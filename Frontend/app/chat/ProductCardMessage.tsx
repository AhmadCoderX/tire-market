import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ensureAbsoluteUrl } from "../services/api";

interface ProductCardData {
  type: 'product_card';
  listingId: string;
  title: string;
  price?: string;
  image?: string;
  message: string;
}

interface ProductCardMessageProps {
  productData: ProductCardData;
  time: string;
  isSender?: boolean;
}

const ProductCardMessage: React.FC<ProductCardMessageProps> = ({
  productData,
  time,
  isSender = false
}) => {
  const router = useRouter();

  const handleCardPress = () => {
    console.log('Product card clicked, navigating to listing:', productData.listingId);
    router.push({
      pathname: "/frame",
      params: { listingId: productData.listingId }
    });
  };

  const getImageSource = () => {
    if (productData.image) {
      return { uri: ensureAbsoluteUrl(productData.image) };
    }
    return require("../../assets/images/placeholder.png");
  };

  return (
    <View style={[
      styles.container,
      isSender ? styles.senderContainer : styles.receiverContainer
    ]}>
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.messageText}>{productData.message}</Text>
        </View>
        
        <View style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource()}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {productData.title}
            </Text>
            
            {productData.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{productData.price}</Text>
              </View>
            )}
            
            <View style={styles.actionContainer}>
              <Text style={styles.viewDetailsText}>Tap to view details →</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <Text style={[styles.timeText, isSender ? styles.senderTimeText : styles.receiverTimeText]}>
        {time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "75%",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  senderContainer: {
    alignSelf: "flex-end",
    marginLeft: 50,
  },
  receiverContainer: {
    alignSelf: "flex-start",
    marginRight: 50,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  messageText: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 18,
  },
  productCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2B2B2B",
    lineHeight: 20,
    marginBottom: 6,
  },
  priceContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#3A593F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  actionContainer: {
    alignSelf: "flex-start",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#6C757D",
    fontStyle: "italic",
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: "flex-end",
    paddingHorizontal: 4,
  },
  senderTimeText: {
    color: "#65676B",
  },
  receiverTimeText: {
    color: "#65676B",
  },
});

export default ProductCardMessage; 