import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const ProductImageSection = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    { id: '1', placeholder: true },
    { id: '2', placeholder: true },
    { id: '3', placeholder: true },
    { id: '4', placeholder: true },
  ];

  return (
    <View style={styles.container}>
      {/* Main Image */}
      <View style={styles.mainImageContainer}>
        <View style={styles.mainImage} />
        
        {/* Navigation Arrows */}
        <TouchableOpacity 
          style={[styles.navButton, styles.prevButton]}
          onPress={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : images.length - 1))}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={() => setSelectedImage(prev => (prev < images.length - 1 ? prev + 1 : 0))}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Thumbnails */}
      <View style={styles.thumbnailsContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.thumbnailButton,
              selectedImage === index && styles.selectedThumbnail,
            ]}
            onPress={() => setSelectedImage(index)}
          >
            <View style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    alignSelf: 'flex-start',
    paddingRight: 24,
  },
  mainImageContainer: {
    minHeight: 600,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 32,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  prevButton: {
    left: 8,
  },
  nextButton: {
    right: 8,
  },
  navButtonText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Arial',
    lineHeight: 20,
  },
  thumbnailsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: 'flex-start',
  },
  thumbnailButton: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: '#AEBB9F',
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "#4F6C46",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});

export default ProductImageSection;