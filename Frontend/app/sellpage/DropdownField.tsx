import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  TextInput,
  Pressable,
  GestureResponderEvent,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, spacing } from "./styles";
import Tooltip from "./Tooltip";

const isSmallScreen = Dimensions.get('window').width < 768;

interface DropdownOption {
  label: string;
  value: string;
  tooltip?: string;
}

interface DropdownFieldProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  containerStyle?: any;
  error?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  containerStyle,
  error,
  searchable = true,
  clearable = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  // Tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(lowerSearchTerm) ||
        option.value.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const handleClear = () => {
    onSelect("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Function to show tooltip
  const handleShowTooltip = (text: string, e: GestureResponderEvent) => {
    if (text) {
      const { pageX, pageY } = e.nativeEvent;
      setTooltipPosition({ x: pageX, y: pageY - 40 });
      setTooltipText(text);
      setTooltipVisible(true);
    }
  };

  // Function to hide tooltip
  const handleHideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && !selectedValue && styles.errorButton,
          disabled && styles.disabledButton
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        {selectedValue && clearable && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            accessibilityLabel={`Clear ${label} selection`}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              
              {searchable && (
                <View style={styles.searchContainer}>
                  <Image
                    source={{
                      uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/e86f0bfa2b37cf27c8be96435afc91b16b86c6b2a48e90e6b76e35b01fd91aaa?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                    }}
                    style={styles.searchIcon}
                    accessibilityIgnoresInvertColors={true}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoCapitalize="none"
                    autoFocus={true}
                    placeholderTextColor="#999"
                  />
                </View>
              )}
              
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      selectedValue === item.value && styles.selectedOption
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setIsOpen(false);
                    }}
                    onLongPress={(e) => item.tooltip && handleShowTooltip(item.tooltip, e)}
                    delayLongPress={500}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedValue === item.value && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noResultsText}>No matching options found</Text>
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <Tooltip
        text={tooltipText}
        visible={tooltipVisible}
        onClose={handleHideTooltip}
        position={tooltipPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    textAlign: 'left',
  },
  placeholderText: {
    color: '#666666',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  clearButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#666666',
    lineHeight: 20,
  },
  error: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    padding: 4,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedOptionText: {
    color: '#3A593F',
    fontWeight: '600',
  },
  noResultsText: {
    padding: 16,
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
  },
  errorButton: {
    borderColor: '#FF0000',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
    borderColor: '#DDDDDD',
  },
  disabledText: {
    color: '#AAAAAA',
  }
});

export default DropdownField;
