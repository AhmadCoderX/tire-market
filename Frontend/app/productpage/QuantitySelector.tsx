import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Quantity</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity style={styles.button} onPress={onDecrease}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={onIncrease}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 1,
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Arial',
    color: '#222222',
    fontWeight: '400',
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 9,
    gap: 4,
  },
  button: {
    width: 20,
    height: 20,
    backgroundColor: '#5B7560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'Arial',
    lineHeight: 20,
  },
  quantityText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Arial',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#5B7560',
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 36,
    height: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QuantitySelector;
