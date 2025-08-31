import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  date: string;
  reviewText: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  rating,
  date,
  reviewText,
}) => {
  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          source={{
            uri:
              i <= rating
                ? "https://cdn.builder.io/api/v1/image/assets/TEMP/7e8d529db7767f094fa39e175f33e238ff018befe3eb38d6d423770c33a75743?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f" // filled star
                : "https://cdn.builder.io/api/v1/image/assets/TEMP/5c5a93f67c4a4c7c2c7e7c7c7c7c7c7c?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f", // empty star
          }}
          style={styles.starIcon}
          accessibilityLabel={i <= rating ? "Filled star" : "Empty star"}
        />
      );
    }
    return stars;
  };

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`Review by ${reviewerName}`}
    >
      <View style={styles.header}>
        <View style={styles.reviewerInfo}>
          <View style={styles.avatarPlaceholder} />
          <View>
            <Text style={styles.reviewerName}>{reviewerName}</Text>
            <View style={styles.ratingContainer}>
              {renderStars()}
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(228, 228, 231, 1)",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  reviewerName: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: "600",
    color: "#2B2B2B",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
  },
  date: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    color: "#969696",
    marginLeft: 8,
  },
  reviewText: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    lineHeight: 20,
    color: "#2B2B2B",
  },
});

export default ReviewCard;
