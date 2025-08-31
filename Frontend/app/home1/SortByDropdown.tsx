import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FilterParams } from "../types";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

interface SortByDropdownProps {
  currentSort?: string;
  onSortChange: (sortBy: string) => void;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Define options with display text and API value
  const options = [
    { display: "Price: Low to High", value: "price_low" },
    { display: "Price: High to Low", value: "price_high" },
    { display: "Newest First", value: "newest" }
  ];

  // Find the current option for display
  const currentOption = options.find(opt => opt.value === currentSort) || options[3]; // Default to newest

  // For mobile, show shorter text
  const getDisplayText = () => {
    if (!isSmallScreen) return `Sort By: ${currentOption.display}`;
    
    // Shorter version for mobile
    switch (currentOption.value) {
      case 'price_low': return 'Price ↑';
      case 'price_high': return 'Price ↓';
      case 'newest': return 'Newest';
      default: return 'Sort';
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: { display: string, value: string }) => {
    onSortChange(option.value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={toggleDropdown}
      >
        <Text numberOfLines={1} style={styles.buttonText}>
          {getDisplayText()}
        </Text>
        <Text style={styles.arrow}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => selectOption(option)}
            >
              <Text style={[
                styles.optionText,
                currentSort === option.value && styles.selectedOption
              ]}>
                {option.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: isSmallScreen ? '#E5E5E5' : '#5B7560',
    borderRadius: 8,
    ...(isSmallScreen
      ? { flex: 0.48, minWidth: 0 }
      : { minWidth: 160, height: 48, paddingHorizontal: 14 }),
    height: isSmallScreen ? 32 : 48,
    paddingHorizontal: isSmallScreen ? 6 : 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 999,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  buttonText: {
    fontSize: isSmallScreen ? 11 : 14,
    color: Colors.light.text,
    marginRight: isSmallScreen ? 2 : 8,
    fontWeight: '500',
  },
  arrow: {
    fontSize: isSmallScreen ? 12 : 18,
    color: Colors.light.text,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: isSmallScreen ? 'auto' : 0,
    left: isSmallScreen ? 0 : 'auto',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: isSmallScreen ? '#E5E5E5' : '#5B7560',
    borderRadius: 8,
    marginTop: 4,
    minWidth: isSmallScreen ? 140 : 180,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  option: {
    paddingVertical: isSmallScreen ? 6 : 14,
    paddingHorizontal: isSmallScreen ? 10 : 18,
    borderBottomWidth: 1,
    borderBottomColor: isSmallScreen ? '#E5E5E5' : '#5B7560',
  },
  optionText: {
    fontSize: isSmallScreen ? 11 : 14,
    color: Colors.light.text,
  },
  selectedOption: {
    backgroundColor: '#F9F9F9',
  },
  selectedOptionText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
});

export default SortByDropdown;