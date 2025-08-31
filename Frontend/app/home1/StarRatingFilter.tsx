import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "./Checkbox";
import { FilterParams } from "../types";

interface StarRatingFilterProps {
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}

const StarRatingFilter: React.FC<StarRatingFilterProps> = ({ filters, onFilterChange }) => {
  const ratings = [5, 4, 3, 2, 1];
  const selectedRating = filters.rating_min;

  const handleRatingSelect = (rating: number) => {
    if (selectedRating === rating) {
      // If already selected, clear the filter
      onFilterChange({
        ...filters,
        rating_min: undefined
      });
    } else {
      // Set new rating minimum
      onFilterChange({
        ...filters,
        rating_min: rating
      });
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
            <Checkbox initialChecked={selectedRating === rating} onChange={() => handleRatingSelect(rating)} />
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

export default StarRatingFilter;
