import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "../home1/Checkbox";

interface ShopRatingFilterProps {
  selectedRating?: number;
  onRatingChange: (rating: number | undefined) => void;
}

const ShopRatingFilter: React.FC<ShopRatingFilterProps> = ({
  selectedRating,
  onRatingChange,
}) => {
  const ratings = [5, 4, 3, 2, 1];

  const handleRatingSelect = (rating: number) => {
    if (selectedRating === rating) {
      onRatingChange(undefined); // Deselect if already selected
    } else {
      onRatingChange(rating);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ratings</Text>
      <View style={styles.optionsContainer}>
        {ratings.map((rating) => (
          <TouchableOpacity 
            key={rating} 
            style={styles.optionRow}
            onPress={() => handleRatingSelect(rating)}
          >
            <Checkbox 
              initialChecked={selectedRating === rating}
              onChange={() => handleRatingSelect(rating)}
            />
            <View style={styles.stars}>
              {[...Array(rating)].map((_, i) => (
                <Text key={i} style={styles.star}>★</Text>
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <Text key={i} style={[styles.star, styles.emptyStar]}>★</Text>
              ))}
            </View>
            <Text style={styles.ratingText}>& Up</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
    backgroundColor: "#F5F5F5",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 16,
    color: "#F59E0B",
  },
  emptyStar: {
    color: "#D1D5DB",
  },
  ratingText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 4,
  }
});

export default ShopRatingFilter; 