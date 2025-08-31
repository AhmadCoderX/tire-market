import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "./Checkbox";

interface SellerTypeFilterProps {
  selectedSellerTypes?: string[];
  onSellerTypeChange: (sellerTypes: string[]) => void;
}

const SellerTypeFilter: React.FC<SellerTypeFilterProps> = ({
  selectedSellerTypes = [],
  onSellerTypeChange,
}) => {
  const handleSellerTypeChange = (sellerType: string) => {
    const currentTypes = selectedSellerTypes || [];
    
    if (currentTypes.includes(sellerType)) {
      // If the selected type is already selected, unselect it
      onSellerTypeChange([]);
    } else {
      // If a different type is selected, replace the current selection with the new one
      onSellerTypeChange([sellerType]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seller Type</Text>
      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          <Checkbox 
            initialChecked={selectedSellerTypes.includes('Individual')}
            onChange={() => handleSellerTypeChange('Individual')}
          />
          <Text style={styles.optionText}>Private Seller</Text>
        </View>
        <View style={styles.optionRow}>
          <Checkbox 
            initialChecked={selectedSellerTypes.includes('Business')}
            onChange={() => handleSellerTypeChange('Business')}
          />
          <Text style={styles.optionText}>Business</Text>
        </View>
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-Regular",
  },
});

export default SellerTypeFilter;
