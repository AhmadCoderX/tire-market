import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDownIcon } from '../figmahomepage/icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  width?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  width = 200,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <ChevronDownIcon color="#333" />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    position: 'relative',
    width: 200,
    zIndex: 99999,
    elevation: 99999, // For Android
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 99999,
    elevation: 99999, // For Android
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 35,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 99999, // For Android
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 99999,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Dropdown;