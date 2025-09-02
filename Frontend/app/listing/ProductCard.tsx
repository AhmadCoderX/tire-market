import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { FONTS, FONT_STYLES } from '../constants/fonts';

interface ProductCardProps {
  title: string;
  price: string;
  postDate: string;
  brand: string;
  model: string;
  condition: string;
  quantity: string;
  imageUrl: string;
  isPromoted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  postDate,
  brand,
  model,
  condition,
  quantity,
  imageUrl,
  isPromoted = false,
}) => {
  const { isSmallScreen, isMediumScreen } = useResponsiveLayout();

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`Product: ${title}`}
    >
      <View
        style={[
          styles.content,
          isSmallScreen && styles.contentSmall,
          isMediumScreen && styles.contentMedium,
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.productImage,
            isSmallScreen && styles.productImageSmall,
          ]}
          accessibilityLabel={`Image of ${title}`}
        />
        <View
          style={[
            styles.detailsContainer,
            isSmallScreen && styles.detailsContainerSmall,
            isMediumScreen && styles.detailsContainerMedium,
          ]}
        >
          <View
            style={[
              styles.productInfo,
              isSmallScreen && styles.productInfoSmall,
              isMediumScreen && styles.productInfoMedium,
            ]}
          >
            <Text
              style={[styles.title, isSmallScreen && styles.titleSmall]}
              accessibilityRole="header"
            >
              {title}
            </Text>
            <View style={styles.detailsSection}>
              <View style={styles.priceSection}>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.postDate}>{postDate}</Text>
              </View>
              <View
                style={[
                  styles.specificationSection,
                  isSmallScreen && styles.specificationSectionSmall,
                ]}
              >
                <View style={styles.specColumn}>
                  <Text style={styles.specText}>Brand: {brand}</Text>
                  <Text style={styles.specText}>Condition: {condition}</Text>
                </View>
                <View style={styles.specColumn}>
                  <Text style={styles.specText}>Model: {model}</Text>
                  <Text style={styles.specText}>Quantity: {quantity}</Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.actionSection,
              isSmallScreen && styles.actionSectionSmall,
            ]}
          >
            <TouchableOpacity
              style={styles.editButton}
              accessibilityRole="button"
              accessibilityLabel="Edit product"
            >
              <Image
                source={{
                  uri: isPromoted
                    ? "https://cdn.builder.io/api/v1/image/assets/TEMP/9544693f5f6bd641e0efa7fa67884ae436b5b83eb2f524e431f2b92f42d93954?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f"
                    : "https://cdn.builder.io/api/v1/image/assets/TEMP/3d1f2056c9a4494e36407bfe1b2b5130417f0dcceb0421d5d30a47f20fd56384?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                }}
                style={styles.editIcon}
                accessibilityLabel="Edit icon"
              />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            {isPromoted ? (
              <View style={styles.promotedBadge}>
                <Text style={styles.promotedText}>Promoted</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.promoteButton}
                accessibilityRole="button"
                accessibilityLabel="Promote this ad"
              >
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/f2b0f01c030958b2e75b3f5c14a1d2dd150afae55209766f99317513b1790303?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.promoteIcon}
                  accessibilityLabel="Promote icon"
                />
                <Text style={styles.promoteButtonText}>Promote Ad</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(228, 228, 231, 1)",
    marginTop: 16,
    width: "100%",
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  contentSmall: {
    flexDirection: "column",
    alignItems: "center",
  },
  contentMedium: {
    gap: 12,
  },
  productImage: {
    width: 142,
    height: 142,
    aspectRatio: 1,
    objectFit: "contain",
  },
  productImageSmall: {
    width: "100%",
    height: 200,
    marginBottom: 12,
  },
  detailsContainer: {
    flex: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignSelf: "stretch",
    flexDirection: "row",
    minWidth: 240,
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 100,
  },
  detailsContainerSmall: {
    width: "100%",
    gap: 16,
  },
  detailsContainerMedium: {
    gap: 20,
  },
  productInfo: {
    minWidth: 240,
    width: 451,
  },
  productInfoSmall: {
    width: "100%",
  },
  productInfoMedium: {
    width: "60%",
  },
  title: {
    ...FONT_STYLES.h4,
    color: "rgba(9, 9, 11, 1)",
  },
  titleSmall: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsSection: {
    marginTop: 12,
    width: "100%",
  },
  priceSection: {
    flexDirection: "column",
  },
  price: {
    ...FONT_STYLES.h5,
    color: "#354E41",
  },
  postDate: {
    ...FONT_STYLES.caption,
    color: "#969696",
    marginTop: 8,
  },
  specificationSection: {
    marginTop: 12,
    width: "100%",
    flexDirection: "row",
    gap: 100,
  },
  specificationSectionSmall: {
    flexDirection: "column",
    gap: 8,
  },
  specColumn: {
    flex: 1,
    gap: 8,
  },
  specText: {
    ...FONT_STYLES.body,
    color: "#666666",
  },
  actionSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    minWidth: 120,
  },
  actionSectionSmall: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionSectionMedium: {
    minWidth: 100,
  },
  contactButton: {
    backgroundColor: "#3A593F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  contactButtonSmall: {
    flex: 1,
    minWidth: "auto",
  },
  contactButtonText: {
    ...FONT_STYLES.button,
    color: "#FFFFFF",
  },
  chatButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3A593F",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  chatButtonSmall: {
    flex: 1,
    minWidth: "auto",
  },
  chatButtonText: {
    ...FONT_STYLES.button,
    color: "#3A593F",
  },
  buttonIcon: {
    width: 16,
    height: 16,
  },
  editButton: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(228, 228, 231, 1)",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    height: 32,
  },
  editIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
    tintColor: "#09090B",
  },
  promoteIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
    tintColor: "#FFFFFF",
  },
  buttonText: {
    color: "rgba(9, 9, 11, 1)",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  promotedBadge: {
    alignSelf: "stretch",
    borderRadius: 4,
    backgroundColor: "#AB9404",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promotedText: {
    color: "#EBEEEC",
    fontFamily: "Geist, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  promoteButton: {
    borderRadius: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 28,
    backgroundColor: "#5B7560",
  },
  promoteButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
});

export default ProductCard;
