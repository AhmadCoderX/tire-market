import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from './styles';

interface PillToggleOption {
  label: string;
  value: string;
}

interface PillToggleProps {
  label: string;
  options: PillToggleOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
  error?: string;
}

const PillToggle: React.FC<PillToggleProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  containerStyle,
  error,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillsContainer}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.pill,
                isSelected ? styles.selectedPill : styles.unselectedPill,
              ]}
              onPress={() => onSelect(option.value)}
              accessibilityRole="radio"
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
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50, // Large value for "pill" shape (rounded-full)
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPill: {
    backgroundColor: colors.primary,
  },
  unselectedPill: {
    backgroundColor: '#f0f0f0', // Light gray
  },
  pillText: {
    fontWeight: '600',
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

export default PillToggle; 