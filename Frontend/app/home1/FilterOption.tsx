import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "./Checkbox";

interface FilterOptionProps {
  title: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
}

const FilterOption: React.FC<FilterOptionProps> = ({ 
  title, 
  options, 
  selectedValues = [], 
  onSelect,
  multiSelect = false
}) => {
  const handleSelect = (value: string) => {
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <Checkbox 
              initialChecked={selectedValues.includes(option.value)}
              onChange={() => handleSelect(option.value)}
            />
            <Text style={styles.optionText}>{option.label}</Text>
          </View>
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

export default FilterOption;
