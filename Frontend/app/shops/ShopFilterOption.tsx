import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Checkbox from "../home1/Checkbox"; // Reuse the existing checkbox component

interface ShopFilterOptionProps {
  title: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  loading?: boolean;
}

const ShopFilterOption: React.FC<ShopFilterOptionProps> = ({ 
  title, 
  options, 
  selectedValues = [], 
  onSelect,
  multiSelect = false,
  loading = false
}) => {
  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : options.length === 0 ? (
          <Text style={styles.noOptionsText}>No services available</Text>
        ) : (
          options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Checkbox 
                initialChecked={selectedValues.includes(option.value)}
                onChange={() => handleSelect(option.value)}
              />
              <Text style={styles.optionText}>{option.label}</Text>
            </View>
          ))
        )}
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
  },
  optionText: {
    fontSize: 14,
    color: "#4B5563",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  noOptionsText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    padding: 12,
  },
});

export default ShopFilterOption; 