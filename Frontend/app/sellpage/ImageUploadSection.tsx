import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { colors, spacing } from "./styles";
import * as ImagePicker from 'expo-image-picker';

interface ImageUploadSectionProps {
  images: string[];
  onAddImage?: (uri: string) => void;
  onRemoveImage?: (index: number) => void;
  error?: string;
  onImagesChange?: (newImages: string[]) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images = [],
  onAddImage,
  onRemoveImage,
  error,
  onImagesChange,
}) => {
  const totalSlots = 12;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    if (onAddImage && images.length < totalSlots) {
      onAddImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current?.click();
    } else if (Platform.OS !== 'web') {
      handleMobileImagePicker();
    }
  };

  const handleMobileImagePicker = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;

        if (onAddImage && images.length < totalSlots) {
          onAddImage(selectedImageUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (onRemoveImage) {
      onRemoveImage(index);
    } else {
      const newImages = [...images];
      newImages.splice(index, 1);
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Images</Text>
      <View style={styles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesContainer}>
            {/* Add Button */}
            {images.length < totalSlots && (
              <>
                {Platform.OS === 'web' && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                )}
                <TouchableOpacity
                  style={[styles.imageSlot, styles.activeImageSlot]}
                  onPress={triggerFileInput}
                  accessibilityRole="button"
                  accessibilityLabel="Add image"
                >
                  <View style={styles.iconContainer}>
                    <Image
                      source={{
                        uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/b86acc980ed3e609cd18d2c61ec609a4d3b15a21681e2bc2655552c4a9cc9008?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f"
                      }}
                      style={styles.addIcon}
                      accessibilityIgnoresInvertColors={true}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* Image Slots */}
            {images.map((image, index) => (
              <View key={index} style={styles.imageSlot}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.image}
                    accessibilityIgnoresInvertColors={true}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                    accessibilityRole="button"
                    accessibilityLabel="Remove image"
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: "column",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  imageSlot: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 8,
    marginBottom: 8,
  },
  activeImageSlot: {
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    backgroundColor: "#EBEEEC",
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  addIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    tintColor: colors.textLight,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: spacing.sm,
  },
});

export default ImageUploadSection;