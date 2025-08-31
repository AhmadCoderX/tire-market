import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { getTireWidths, getTireAspectRatios, getTireDiameters } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

interface TireSizeFilterProps {
  onSizeSelect?: (size: string) => void;
}

const TireSizeFilter: React.FC<TireSizeFilterProps> = ({ onSizeSelect }) => {
  const [widths, setWidths] = useState<number[]>([]);
  const [aspectRatios, setAspectRatios] = useState<number[]>([]);
  const [diameters, setDiameters] = useState<number[]>([]);

  const [selectedWidth, setSelectedWidth] = useState<number | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(null);
  const [selectedDiameter, setSelectedDiameter] = useState<number | null>(null);

  const [widthDropdownOpen, setWidthDropdownOpen] = useState(false);
  const [aspectDropdownOpen, setAspectDropdownOpen] = useState(false);
  const [diameterDropdownOpen, setDiameterDropdownOpen] = useState(false);

  const [widthSearch, setWidthSearch] = useState('');
  const [aspectSearch, setAspectSearch] = useState('');
  const [diameterSearch, setDiameterSearch] = useState('');

  // Button refs and layouts for modal positioning
  const widthButtonRef = useRef<View>(null);
  const aspectButtonRef = useRef<View>(null);
  const diameterButtonRef = useRef<View>(null);
  
  const [widthButtonLayout, setWidthButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectButtonLayout, setAspectButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [diameterButtonLayout, setDiameterButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Animation for dropdown transitions
  const aspectAnim = useRef(new Animated.Value(0)).current;
  const diameterAnim = useRef(new Animated.Value(0)).current;

  // Fetch widths on mount
  useEffect(() => {
    getTireWidths().then(setWidths).catch(() => setWidths([]));
  }, []);

  // Fetch aspect ratios when width is selected
  useEffect(() => {
    if (selectedWidth !== null) {
      getTireAspectRatios(selectedWidth).then(setAspectRatios).catch(() => setAspectRatios([]));
      Animated.timing(aspectAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setAspectRatios([]);
      setSelectedAspectRatio(null);
      Animated.timing(aspectAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [selectedWidth]);

  // Fetch diameters when aspect ratio is selected
  useEffect(() => {
    if (selectedWidth !== null && selectedAspectRatio !== null) {
      getTireDiameters(selectedWidth, selectedAspectRatio).then(setDiameters).catch(() => setDiameters([]));
      Animated.timing(diameterAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setDiameters([]);
      setSelectedDiameter(null);
      Animated.timing(diameterAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [selectedAspectRatio, selectedWidth]);

  // Handle selection
  const handleWidthSelect = (width: number) => {
    setSelectedWidth(width);
    setWidthDropdownOpen(false);
    setAspectSearch('');
    setDiameterSearch('');
    setSelectedAspectRatio(null);
    setSelectedDiameter(null);
  };
  
  const handleAspectSelect = (aspect: number) => {
    setSelectedAspectRatio(aspect);
    setAspectDropdownOpen(false);
    setDiameterSearch('');
    setSelectedDiameter(null);
  };
  
  const handleDiameterSelect = (diameter: number) => {
    setSelectedDiameter(diameter);
    setDiameterDropdownOpen(false);
    if (onSizeSelect) {
      onSizeSelect(`${selectedWidth}/${selectedAspectRatio}/${diameter}`);
    }
  };

  // Open dropdown functions with positioning
  const openWidthDropdown = () => {
    if (widthButtonRef.current) {
      widthButtonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setWidthButtonLayout({ x, y, width, height });
        setWidthDropdownOpen(true);
      });
    }
  };

  const openAspectDropdown = () => {
    if (aspectButtonRef.current) {
      aspectButtonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setAspectButtonLayout({ x, y, width, height });
        setAspectDropdownOpen(true);
      });
    }
  };

  const openDiameterDropdown = () => {
    if (diameterButtonRef.current) {
      diameterButtonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setDiameterButtonLayout({ x, y, width, height });
        setDiameterDropdownOpen(true);
      });
    }
  };
  
  const handleClear = () => {
    setSelectedWidth(null);
    setSelectedAspectRatio(null);
    setSelectedDiameter(null);
    setWidthSearch('');
    setAspectSearch('');
    setDiameterSearch('');
    setWidthDropdownOpen(false);
    setAspectDropdownOpen(false);
    setDiameterDropdownOpen(false);
    if (onSizeSelect) onSizeSelect('');
  };

  // Filtered dropdown options
  const filteredWidths = widths.filter(w => w.toString().includes(widthSearch));
  const filteredAspects = aspectRatios.filter(a => a.toString().includes(aspectSearch));
  const filteredDiameters = diameters.filter(d => d.toString().includes(diameterSearch));

  // Render dropdown button
  const renderDropdownButton = (
    ref: React.RefObject<View>,
    isOpen: boolean,
    onPress: () => void,
    placeholder: string,
    selectedValue: number | null
  ) => (
    <TouchableOpacity
      ref={ref}
      style={[styles.dropdownButton, isOpen && styles.dropdownButtonOpen]}
      onPress={onPress}
    >
      <Text style={styles.dropdownButtonText}>
        {selectedValue ? selectedValue.toString() : placeholder}
      </Text>
      <Ionicons 
        name={isOpen ? "chevron-up" : "chevron-down"} 
        size={16} 
        color="#666" 
      />
    </TouchableOpacity>
  );

  // Render dropdown modal
  const renderDropdownModal = (
    isOpen: boolean,
    onClose: () => void,
    options: number[],
    onSelect: (value: number) => void,
    buttonLayout: { x: number, y: number, width: number, height: number },
    searchValue: string,
    onSearchChange: (value: string) => void,
    searchPlaceholder: string
  ) => {
    const screenHeight = Dimensions.get('window').height;
    const dropdownTop = buttonLayout.y + buttonLayout.height;
    const dropdownMaxHeight = Math.min(200, screenHeight - dropdownTop - 50);

    return (
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.dropdownModal,
              {
                top: dropdownTop,
                left: buttonLayout.x,
                width: buttonLayout.width,
                maxHeight: dropdownMaxHeight,
              }
            ]}
            onPress={() => {}} // Prevent modal close when clicking inside dropdown
          >
            <TextInput
              style={styles.dropdownSearch}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChangeText={onSearchChange}
              keyboardType="numeric"
            />
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {options.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options available</Text>
                </View>
              )}
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => onSelect(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  // Animated containers for aspect and diameter
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tire Size</Text>
      {/* Step 1: Width Dropdown */}
      {renderDropdownButton(widthButtonRef, widthDropdownOpen, openWidthDropdown, selectedWidth ? selectedWidth.toString() : 'Width (mm)', selectedWidth)}
      {/* Step 2: Aspect Ratio Dropdown */}
      <Animated.View style={{ opacity: aspectAnim, transform: [{ scale: aspectAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }}>
        {selectedWidth !== null && renderDropdownButton(aspectButtonRef, aspectDropdownOpen, openAspectDropdown, selectedAspectRatio ? selectedAspectRatio.toString() : 'Aspect Ratio', selectedAspectRatio)}
      </Animated.View>
      {/* Step 3: Diameter Dropdown */}
      <Animated.View style={{ opacity: diameterAnim, transform: [{ scale: diameterAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }}>
        {selectedWidth !== null && selectedAspectRatio !== null && renderDropdownButton(diameterButtonRef, diameterDropdownOpen, openDiameterDropdown, selectedDiameter ? selectedDiameter.toString() : 'Diameter (in)', selectedDiameter)}
      </Animated.View>
      {/* Selected Size Badge */}
      {selectedWidth && selectedAspectRatio && selectedDiameter && (
        <View style={styles.selectedPill}>
          <Text style={styles.selectedPillText}>{`${selectedWidth}/${selectedAspectRatio}/${selectedDiameter}`}</Text>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Clear Button */}
      {(selectedWidth || selectedAspectRatio || selectedDiameter) && (
        <TouchableOpacity onPress={handleClear} style={styles.clearAllButton}>
          <Text style={styles.clearAllButtonText}>Clear Tire Size</Text>
        </TouchableOpacity>
      )}

      {/* Width Dropdown Modal */}
      {renderDropdownModal(
        widthDropdownOpen,
        () => setWidthDropdownOpen(false),
        filteredWidths,
        handleWidthSelect,
        widthButtonLayout,
        widthSearch,
        setWidthSearch,
        "Search Width (mm)"
      )}

      {/* Aspect Ratio Dropdown Modal */}
      {renderDropdownModal(
        aspectDropdownOpen,
        () => setAspectDropdownOpen(false),
        filteredAspects,
        handleAspectSelect,
        aspectButtonLayout,
        aspectSearch,
        setAspectSearch,
        "Search Aspect Ratio"
      )}

      {/* Diameter Dropdown Modal */}
      {renderDropdownModal(
        diameterDropdownOpen,
        () => setDiameterDropdownOpen(false),
        filteredDiameters,
        handleDiameterSelect,
        diameterButtonLayout,
        diameterSearch,
        setDiameterSearch,
        "Search Diameter (in)"
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 4,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
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
    marginBottom: 10,
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
  dropdownSearch: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 12,
    fontSize: 14,
    color: '#374151',
  },
  optionsList: {
    maxHeight: 200,
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  selectedPillText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 8,
    fontWeight: "500",
  },
  clearButton: {
    padding: 2,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  clearAllButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  clearAllButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default TireSizeFilter;
