import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const sellerOptions = ["All Sellers", "Verified Sellers", "Premium Sellers"];

const SellerTypeDropdown = () => {
  const [selectedOption, setSelectedOption] = useState("Seller type");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Seller type dropdown"
        accessibilityHint="Select a seller type"
        accessibilityState={{ expanded: isOpen }}
      >
        <Text style={styles.buttonText}>{selectedOption}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View
          style={styles.dropdownMenu}
          accessible={true}
          accessibilityRole="menu"
          accessibilityLabel="Seller type options"
        >
          {sellerOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => handleSelect(option)}
              accessible={true}
              accessibilityRole="menuitem"
              accessibilityLabel={option}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 99999,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    minWidth: 120,
    position: 'relative',
    zIndex: 9999,
  },
  buttonText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Arial",
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666666",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
    width: "100%",
    zIndex: 100000,
    elevation: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Arial",
  },
});

export default SellerTypeDropdown;
