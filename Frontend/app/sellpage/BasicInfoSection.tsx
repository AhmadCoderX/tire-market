// In BasicInfoSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FormField from "./FormField";
import PriceInput from "./PriceInput";
import { colors, spacing } from "./styles";

interface BasicInfoSectionProps {
  title: string;
  price: string;
  description: string;
  onTitleChange: (text: string) => void;
  onPriceChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  errors?: {
    title?: string;
    price?: string;
    description?: string;
  };
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  onTitleChange,
  description,
  price,
  onDescriptionChange,
  onPriceChange,
  errors = {},
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Basic Information</Text>
      <View style={styles.fieldsContainer}>
        <FormField
          label="Title"
          value={title}
          onChangeText={onTitleChange}
          error={errors.title}
          accessibilityLabel="Product title"
          accessibilityHint="Enter the title of your product"
          containerStyle={styles.field}
        />
        <PriceInput
          label="Price"
          value={price}
          onValueChange={onPriceChange}
          error={errors.price}
          containerStyle={styles.field}
        />
        <FormField
          label="Description"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          error={errors.description}
          containerStyle={styles.field}
          accessibilityLabel="Product description"
          accessibilityHint="Enter a detailed description of your product"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  fieldsContainer: {
    gap: spacing.xs,
  },
  field: {
    marginBottom: 0,
  },
});

export default BasicInfoSection;