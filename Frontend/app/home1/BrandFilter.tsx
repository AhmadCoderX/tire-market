import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface BrandFilterProps {
  selectedBrand?: string;
  onBrandChange: (brand: string | undefined) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onBrandChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);

  const brands = [
    "Michelin",
    "Goodyear", 
    "Bridgestone",
    "Continental",
    "Pirelli",
    "Dunlop",
    "Yokohama",
    "Hankook",
    "BFGoodrich",
    "Firestone",
    "Others"
  ];

  const handleBrandSelect = (brand: string) => {
    if (selectedBrand === brand) {
      // If the same brand is selected, clear the selection
      onBrandChange(undefined);
    } else {
      // Select the new brand
      onBrandChange(brand);
    }
    
    // Auto-close dropdown after selection
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const clearSelection = () => {
    onBrandChange(undefined);
  };

  const openDropdown = () => {
    // Measure button position before opening modal
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setButtonLayout({ x, y, width, height });
        setIsDropdownOpen(true);
      });
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const screenHeight = Dimensions.get('window').height;
  const dropdownTop = buttonLayout.y + buttonLayout.height;
  const dropdownMaxHeight = Math.min(200, screenHeight - dropdownTop - 50);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brand</Text>
        {selectedBrand && (
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Brand Display - Always Visible when selected */}
      {selectedBrand && (
        <View style={styles.selectedContainer}>
          <View style={styles.selectedChip}>
            <Text style={styles.selectedChipText}>{selectedBrand}</Text>
            <TouchableOpacity
              onPress={clearSelection}
              style={styles.removeButton}
            >
              <Ionicons name="close" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Dropdown Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.dropdownButton, isDropdownOpen && styles.dropdownButtonOpen]}
        onPress={openDropdown}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedBrand || "Select brand"}
        </Text>
        <Ionicons 
          name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#666" 
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <View 
            style={[
              styles.dropdownModal,
              {
                top: dropdownTop,
                left: buttonLayout.x,
                width: buttonLayout.width,
                maxHeight: dropdownMaxHeight,
              }
            ]}
          >
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.optionItem,
                    selectedBrand === brand && styles.optionItemSelected
                  ]}
                  onPress={() => handleBrandSelect(brand)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedBrand === brand && styles.optionTextSelected
                  ]}>
                    {brand}
                  </Text>
                  {selectedBrand === brand && (
                    <Ionicons name="checkmark" size={16} color="#059669" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  clearButton: ViewStyle;
  clearText: TextStyle;
  selectedContainer: ViewStyle;
  selectedChip: ViewStyle;
  selectedChipText: TextStyle;
  removeButton: ViewStyle;
  dropdownButton: ViewStyle;
  dropdownButtonOpen: ViewStyle;
  dropdownButtonText: TextStyle;
  modalOverlay: ViewStyle;
  dropdownModal: ViewStyle;
  optionsList: ViewStyle;
  optionItem: ViewStyle;
  optionItemSelected: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "Poppins-SemiBold",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },
  selectedContainer: {
    marginBottom: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  selectedChipText: {
    fontSize: 12,
    color: '#374151',
    marginRight: 4,
    fontWeight: '500',
    fontFamily: "Poppins-Medium",
  },
  removeButton: {
    padding: 2,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownButtonOpen: {
    borderColor: '#059669',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: "Poppins-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#D1FAE5',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: "Poppins-Regular",
  },
  optionTextSelected: {
    color: '#059669',
    fontWeight: '500',
    fontFamily: "Poppins-Medium",
  },
});

export default BrandFilter;
