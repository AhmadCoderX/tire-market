import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from "react-native";
import { colors, spacing } from "./styles";

// Data from tire_data_markdown.md
const METRIC_WIDTHS = [
  "120", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", 
  "180", "185", "190", "195", "200", "205", "210", "215", "220", "225", "230", 
  "235", "240", "245", "250", "255", "260", "265", "270", "275", "280", "285", 
  "290", "295", "300", "305", "310", "315", "320", "325", "330", "335", "340", 
  "345", "350", "355", "360", "365", "375", "385", "395"
];

const OFF_ROAD_WIDTHS = [
  "9.50", "10.50", "11.50", "12.50", "13.50", "14.50", "15.50", "16.50", "17.50", 
  "18.50", "19.50", "20.50", "21.50", "22.50", "23.50", "24.50", "25.50", "26.50", 
  "27.50", "28.50", "29.50", "30.50"
];

const ASPECT_RATIOS = [
  "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "100"
];

const RIM_DIAMETERS = [
  "10", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "26", "28", "30", "32"
];

// Create dropdown options from the data
const widthOptions = [
  ...METRIC_WIDTHS.map(w => ({ label: `${w} mm`, value: w })),
  ...OFF_ROAD_WIDTHS.map(w => ({ label: `${w} inches`, value: w }))
];

const aspectRatioOptions = ASPECT_RATIOS.map(ar => ({ label: ar, value: ar }));
const diameterOptions = RIM_DIAMETERS.map(d => ({ label: `${d}"`, value: d }));

interface TireSizeSelectorProps {
  width: string;
  aspectRatio: string;
  diameter: string;
  onWidthChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onDiameterChange: (value: string) => void;
  error?: string;
}

const TireSizeSelector: React.FC<TireSizeSelectorProps> = ({
  width,
  aspectRatio,
  diameter,
  onWidthChange,
  onAspectRatioChange,
  onDiameterChange,
  error
}) => {
  const [isWidthOpen, setIsWidthOpen] = useState(false);
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState(false);
  const [isDiameterOpen, setIsDiameterOpen] = useState(false);

  // Add a state to track when all three values are selected
  const [isComplete, setIsComplete] = useState(false);

  // Update the complete state when all values are selected
  useEffect(() => {
    setIsComplete(!!width && !!aspectRatio && !!diameter);
  }, [width, aspectRatio, diameter]);

  const renderDropdown = (
    label: string,
    options: { label: string; value: string }[],
    selectedValue: string,
    onSelect: (value: string) => void,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void
  ) => {
    const selectedOption = options.find(option => option.value === selectedValue);

    return (
      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            error && !selectedValue && styles.errorButton
          ]}
          onPress={() => setIsOpen(true)}
        >
          <Text style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText
          ]}>
            {selectedOption ? selectedOption.label : `Select ${label.toLowerCase()}`}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

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
                
                <FlatList
                  data={options}
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
                    >
                      <Text style={[
                        styles.optionText,
                        selectedValue === item.value && styles.selectedOptionText
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <Text style={styles.sectionLabel}>Tire Size</Text>
        
        {/* Size badge that appears when all fields are filled */}
        {isComplete && (
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeBadgeText}>{width}/{aspectRatio}/{diameter}</Text>
          </View>
        )}
      </View>

      {renderDropdown(
        "Width",
        widthOptions,
        width,
        onWidthChange,
        isWidthOpen,
        setIsWidthOpen
      )}

      {renderDropdown(
        "Aspect Ratio",
        aspectRatioOptions,
        aspectRatio,
        onAspectRatioChange,
        isAspectRatioOpen,
        setIsAspectRatioOpen
      )}

      {renderDropdown(
        "Diameter",
        diameterOptions,
        diameter,
        onDiameterChange,
        isDiameterOpen,
        setIsDiameterOpen
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    marginTop: 32,
    zIndex: 1,
  },
  dropdownWrapper: {
    marginBottom: 16,
    zIndex: 1,
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
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
  sizeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeBadgeText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  errorButton: {
    borderColor: '#FF0000',
  }
});

export default TireSizeSelector; 