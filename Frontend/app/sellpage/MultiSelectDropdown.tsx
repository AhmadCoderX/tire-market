import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { colors, spacing } from './styles';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  clearable?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
  maxDisplayed?: number;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options...',
  clearable = true,
  containerStyle,
  error,
  maxDisplayed = 50
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get selected items details
  const selectedItems = options.filter(option => 
    selectedValues.includes(option.value)
  );

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      // Remove the option
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      // Add the option
      onSelectionChange([...selectedValues, value]);
      // Close the dropdown if this is a single-select dropdown (indicated by the label)
      if (label.toLowerCase().includes('brand')) {
        setIsOpen(false);
      }
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const handleRemoveItem = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Display selected items as chips
  const renderSelectedItems = () => {
    if (selectedItems.length === 0) return null;

    return (
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        style={styles.chipsContainer}
      >
        {selectedItems.map(item => (
          <View key={item.value} style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>
              {item.label}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.value)}
              style={styles.chipRemove}
              accessibilityLabel={`Remove ${item.label}`}
              accessibilityRole="button"
            >
              <Text style={styles.chipRemoveText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[
        styles.dropdownButton,
        error && selectedItems.length === 0 && styles.errorButton
      ]}>
        <TouchableOpacity
          style={styles.dropdownButtonContent}
          onPress={toggleDropdown}
          accessibilityLabel={label}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
        >
          <Text style={[
            styles.dropdownText,
            selectedItems.length === 0 && styles.placeholder
          ]}>
            {selectedItems.length > 0 
              ? `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`
              : placeholder
            }
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
        
        {clearable && selectedItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSelection}
            accessibilityLabel="Clear selection"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderSelectedItems()}
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              
              <FlatList
                data={options.slice(0, maxDisplayed)}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = selectedValues.includes(item.value);
                  
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        isSelected && styles.selectedOption
                      ]}
                      onPress={() => toggleOption(item.value)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                      accessibilityLabel={item.label}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                style={styles.optionsList}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    textAlign: 'left',
  },
  placeholder: {
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
  chipsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    maxHeight: 35,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    color: '#2E7D32',
    fontSize: 12,
    maxWidth: 120,
  },
  chipRemove: {
    marginLeft: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipRemoveText: {
    color: '#2E7D32',
    fontSize: 18,
    lineHeight: 18,
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
  optionsList: {
    maxHeight: 300,
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
  errorButton: {
    borderColor: '#FF0000',
  }
});

export default MultiSelectDropdown; 