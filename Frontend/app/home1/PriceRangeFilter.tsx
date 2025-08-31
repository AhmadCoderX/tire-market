import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FilterParams } from "../types";

interface PriceRangeFilterProps {
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ filters, onFilterChange }) => {
  const [minPrice, setMinPrice] = useState(filters.price_min?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.price_max?.toString() || "");

  const handlePriceSubmit = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    onFilterChange({
      ...filters,
      price_min: min,
      price_max: max
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Range</Text>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Min"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          onSubmitEditing={handlePriceSubmit}
          returnKeyType="done"
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          style={styles.input}
          placeholder="Max"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          onSubmitEditing={handlePriceSubmit}
          returnKeyType="done"
        />
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
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "90%",
  },
  input: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#4B5563",
    maxWidth: "45%",
  },
  separator: {
    fontSize: 14,
    color: "#4B5563",
    paddingHorizontal: 4,
  },
});

export default PriceRangeFilter;
