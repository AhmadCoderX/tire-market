import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { formStyles } from "./formStyles";

interface ActionButtonsProps {
  onCancel: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onPublish,
  isSubmitting,
}) => {
  return (
    <View style={formStyles.buttonBar}>
      <TouchableOpacity
        style={formStyles.cancelButton}
        onPress={onCancel}
        disabled={isSubmitting}
        accessibilityLabel="Cancel"
        accessibilityRole="button"
      >
        <Text style={formStyles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={formStyles.publishButton}
        onPress={onPublish}
        disabled={isSubmitting}
        accessibilityLabel="Publish ad"
        accessibilityRole="button"
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={formStyles.publishButtonText}>Publish ad</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;