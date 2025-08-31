import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from './styles';

interface PriceInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  containerStyle?: ViewStyle;
  error?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onValueChange,
  containerStyle,
  error,
}) => {
  // Validate the input value
  const validateInput = (inputValue: string) => {
    // Remove non-numeric characters except for decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    
    // Ensure there's at most one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // If there's a decimal, limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericValue;
  };

  const handleChange = (text: string) => {
    const validatedValue = validateInput(text);
    onValueChange(validatedValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.prefixContainer}>
          <Text style={styles.prefix}>CAD $</Text>
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder="0.00"
          keyboardType="numeric"
          accessibilityLabel="Price in Canadian dollars"
          accessibilityHint="Enter a positive price value with up to 2 decimal places"
        />
      </View>
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
    position: 'relative',
    marginTop: spacing.xs,
  },
  prefixContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 12,
    justifyContent: 'center',
    zIndex: 1,
  },
  prefix: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingLeft: 64, // Leave space for the prefix
    paddingRight: 12,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default PriceInput; 