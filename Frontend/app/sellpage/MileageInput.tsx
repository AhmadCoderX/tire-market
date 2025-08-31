import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { colors, spacing } from './styles';

interface MileageInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  containerStyle?: ViewStyle;
  error?: string;
}

const unitOptions = [
  { label: "mi", value: "mi" },
  { label: "km", value: "km" },
];

const MileageInput: React.FC<MileageInputProps> = ({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  containerStyle,
  error,
}) => {
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);

  const handleUnitSelect = (selectedUnit: string) => {
    onUnitChange(selectedUnit);
    setIsUnitModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onValueChange}
          placeholder="0"
          keyboardType="numeric"
          accessibilityLabel={`${label} value`}
        />
        <TouchableOpacity
          style={styles.unitButton}
          onPress={() => setIsUnitModalVisible(true)}
        >
          <Text style={styles.unitText}>{unit}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isUnitModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUnitModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsUnitModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={unitOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      unit === item.value && styles.selectedOption
                    ]}
                    onPress={() => handleUnitSelect(item.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      unit === item.value && styles.selectedOptionText
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

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  unitButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  unitText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    width: '80%',
    maxHeight: '50%',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default MileageInput;