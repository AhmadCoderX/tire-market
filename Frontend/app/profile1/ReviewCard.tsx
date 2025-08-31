import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Import the local placeholder image
const placeholderImage = require('../../assets/images/profile-placeholder.png');

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  date: string;
  reviewText: string;
  reviewerImage?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  rating,
  date,
  reviewText,
  reviewerImage,
}) => {
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? "star" : "star-o"}
        size={16}
        color={index < rating ? "#FFB800" : "#C4C4C4"}
        style={styles.star}
        />
    ));
  };

  return (
    <View style={styles.container} accessibilityRole="none">
      <View style={styles.header}>
        <View style={styles.reviewerInfo}>
          {reviewerImage && reviewerImage !== "" ? (
            <Image
              source={{ uri: reviewerImage }}
              style={styles.reviewerImage}
              onError={() => console.log("Error loading profile image")}
            />
          ) : (
          <Image
              source={placeholderImage}
            style={styles.reviewerImage}
          />
          )}
          <View style={styles.nameAndDate}>
            <Text style={styles.reviewerName}>{reviewerName}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
        <View style={styles.rating} accessibilityLabel={`Rating: ${rating} out of 5 stars`}>
          {renderStars()}
        </View>
      </View>
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F5F5F5",
    resizeMode: "cover",
  },
  nameAndDate: {
    justifyContent: "center",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#344E41",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#666666",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
});

export default ReviewCard; 