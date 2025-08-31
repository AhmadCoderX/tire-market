import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Image } from "react-native";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./Icons";

interface ProductGalleryProps {
  images?: Array<{
    id: string;
    image_url: string;
    thumbnail_url?: string;
    is_primary: boolean;
  }>;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // If no images provided, display a placeholder
  const displayImages = images.length > 0
    ? images
    : [{ id: 'placeholder', image_url: '', thumbnail_url: '', is_primary: true }];

  const totalImages = displayImages.length;

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  };

  const handleThumbnailPress = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <View style={[
      styles.gallery,
      isMobile && styles.galleryMobile
    ]}>
      <View style={[
        styles.mainImageContainer,
        isMobile && styles.mainImageContainerMobile
      ]}>
        {displayImages[activeIndex].image_url ? (
          <Image
            source={{ uri: displayImages[activeIndex].image_url }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        ) : (
          // Placeholder when no image is available
          <View style={styles.placeholderImage}>
            <Image 
              source={require('../../assets/images/placeholder.png')} 
              style={styles.placeholderImage}
              resizeMode="contain"
            />
          </View>
        )}

        {totalImages > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevious}
              accessibilityLabel="Previous image"
            >
              <ChevronLeftIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
              accessibilityLabel="Next image"
            >
              <ChevronRightIcon />
            </TouchableOpacity>
          </>
        )}
      </View>

      {totalImages > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailRow}
        >
          {displayImages.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              style={[
                styles.thumbnail,
                activeIndex === index && styles.activeThumbnail,
              ]}
              onPress={() => handleThumbnailPress(index)}
              accessibilityLabel={`Thumbnail image ${index + 1}`}
              accessibilityRole="button"
            >
              {image.thumbnail_url ? (
                <Image
                  source={{ uri: image.thumbnail_url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ) : image.image_url ? (
                <Image
                  source={{ uri: image.image_url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ) : (
                <Image 
                  source={require('../../assets/images/placeholder.png')} 
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gallery: {
    width: 700,
    maxWidth: "90%",
    marginBottom: 0,
  },
  galleryMobile: {
    width: "100%",
    maxWidth: "100%",
    marginBottom: 0,
  },
  mainImageContainer: {
    position: "relative",
    width: "100%",
    height: 600,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 0,
  },
  mainImageContainerMobile: {
    height: 500,
    marginBottom: 0,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#AEBBB0",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -20 }],
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  thumbnailRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  thumbnail: {
    width: 161,
    height: 161,
    borderRadius: 6,
    backgroundColor: "#EAEAEA",
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: "#5B7560",
  },
});

export default ProductGallery;
