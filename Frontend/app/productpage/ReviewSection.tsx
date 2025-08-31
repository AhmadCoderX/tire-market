import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ReviewItem from "./ReviewItem";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  profileImage: string | null | undefined;
}

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    profileImage: string | null | undefined;
  }>;
  onWriteReview: () => void;
}

// Import the local placeholder image
const placeholderImage = require('../../assets/images/profile-placeholder.png');

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating,
  reviewCount,
  reviews,
  onWriteReview
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Product Reviews
        </Text>
        <TouchableOpacity
          style={styles.submitButton}
          accessibilityRole="button"
          accessibilityLabel="Submit a review"
          onPress={onWriteReview}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingOverview}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/58d7946c7966a39da4f3535db418c3e573ee103c6bd5423308b004d5ef2a3390?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
          }}
          style={styles.ratingStars}
          accessibilityLabel={`${rating} out of 5 stars`}
        />
        <View style={styles.ratingTextContainer}>
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
        </View>
      </View>

      <View style={styles.reviewsList}>
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            userName={review.userName}
            rating={review.rating}
            date={review.date}
            comment={review.comment}
            profileImage={review.profileImage}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Arial",
    fontSize: 30,
    fontWeight: "600",
    color: "#1E1E1E",
    lineHeight: 36,
  },
  submitButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#5B7560",
    paddingBottom: 4,
  },
  submitButtonText: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    color: "#5B7560",
    lineHeight: 14,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16, // Reduced from 24 to create less spacing
    gap: 5,
  },
  ratingStars: {
    width: 100,
    height: 20,
    resizeMode: "contain",
  },
  ratingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    lineHeight: 36,
  },
  reviewCount: {
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "400",
    color: "#344E41",
  },
  reviewsList: {
    marginTop: 16, // Reduced from 24 to create less spacing
    gap: 16,
  },
});

export default ReviewSection;