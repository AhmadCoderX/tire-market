import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from './styles';

interface MultiSelectPillOption {
  label: string;
  value: string;
}

interface MultiSelectPillProps {
  label: string;
  options: MultiSelectPillOption[];
  selectedValues: string[];
  onToggleOption: (value: string) => void;
  containerStyle?: ViewStyle;
  error?: string;
  helperText?: string;
}

const MultiSelectPill: React.FC<MultiSelectPillProps> = ({
  label,
  options,
  selectedValues,
  onToggleOption,
  containerStyle,
  error,
  helperText,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
      
      <View style={styles.pillsContainer}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pill,
                isSelected ? styles.selectedPill : styles.unselectedPill,
              ]}
              onPress={() => onToggleOption(option.value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${option.label} option for ${label}`}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.selectedPillText : styles.unselectedPillText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  helperText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50, // Fully rounded (rounded-full)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedPill: {
    backgroundColor: colors.primary,
  },
  unselectedPill: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db', // light gray (border-gray-300)
  },
  pillText: {
    fontWeight: '500',
    fontSize: 14,
  },
  selectedPillText: {
    color: 'white',
  },
  unselectedPillText: {
    color: '#333333', // Dark gray
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default MultiSelectPill; 