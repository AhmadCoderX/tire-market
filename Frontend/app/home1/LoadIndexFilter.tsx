import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, ViewStyle, TextStyle } from "react-native";
import { getLoadIndices } from "../services/api";
import { Ionicons } from '@expo/vector-icons';

interface LoadIndexFilterProps {
  selectedLoadIndices?: string[];
  onLoadIndexChange: (loadIndices: string[]) => void;
}

const LoadIndexFilter: React.FC<LoadIndexFilterProps> = ({
  selectedLoadIndices = [],
  onLoadIndexChange,
}) => {
  const [loadIndices, setLoadIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);

  useEffect(() => {
    const fetchLoadIndices = async () => {
      try {
        setLoading(true);
        setError(null);
        const indices = await getLoadIndices();
        setLoadIndices(indices);
      } catch (err) {
        console.error('Error fetching load indices:', err);
        setError('Failed to load load indices');
      } finally {
        setLoading(false);
      }
    };

    fetchLoadIndices();
  }, []);

  const handleLoadIndexSelect = (loadIndex: number) => {
    const loadIndexString = loadIndex.toString();
    let newLoadIndices: string[];
    
    if (selectedLoadIndices.includes(loadIndexString)) {
      // Remove the load index if it's already selected
      newLoadIndices = selectedLoadIndices.filter(index => index !== loadIndexString);
    } else {
      // Add the load index if it's not selected
      newLoadIndices = [...selectedLoadIndices, loadIndexString];
    }
    
    onLoadIndexChange(newLoadIndices);
    
    // Auto-close dropdown after selection
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const removeLoadIndex = (loadIndex: string) => {
    const newLoadIndices = selectedLoadIndices.filter(index => index !== loadIndex);
    onLoadIndexChange(newLoadIndices);
  };

  const clearAll = () => {
    onLoadIndexChange([]);
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Load Index</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Load Index</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (loadIndices.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Load Index</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No load indices available</Text>
        </View>
      </View>
    );
  }

  const screenHeight = Dimensions.get('window').height;
  const dropdownTop = buttonLayout.y + buttonLayout.height;
  const dropdownMaxHeight = Math.min(200, screenHeight - dropdownTop - 50);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Load Index</Text>
        {selectedLoadIndices.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Items Display */}
      {selectedLoadIndices.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedScroll}>
            {selectedLoadIndices.map((index) => (
              <View key={index} style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{index}</Text>
                <TouchableOpacity
                  onPress={() => removeLoadIndex(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Dropdown Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.dropdownButton, isDropdownOpen && styles.dropdownButtonOpen]}
        onPress={openDropdown}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedLoadIndices.length > 0 
            ? `${selectedLoadIndices.length} selected` 
            : "Select load indices"}
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
              {loadIndices.map((index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    selectedLoadIndices.includes(index.toString()) && styles.optionItemSelected
                  ]}
                  onPress={() => handleLoadIndexSelect(index)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedLoadIndices.includes(index.toString()) && styles.optionTextSelected
                  ]}>
                    {index}
                  </Text>
                  {selectedLoadIndices.includes(index.toString()) && (
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
  selectedScroll: ViewStyle;
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
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
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
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  selectedContainer: {
    marginBottom: 8,
  },
  selectedScroll: {
    flexDirection: 'row',
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
  },
  selectedChipText: {
    fontSize: 12,
    color: '#374151',
    marginRight: 4,
    fontWeight: '500',
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
  },
  optionTextSelected: {
    color: '#059669',
    fontWeight: '500',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  emptyContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
});

export default LoadIndexFilter; 