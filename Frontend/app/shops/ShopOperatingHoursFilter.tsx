import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "../home1/Checkbox";

interface ShopOperatingHoursFilterProps {
  selectedHours: string[];
  onOperatingHoursChange: (hours: string) => void;
}

const ShopOperatingHoursFilter: React.FC<ShopOperatingHoursFilterProps> = ({
  selectedHours,
  onOperatingHoursChange,
}) => {
  const operatingHoursOptions = [
    { 
      label: "Open Now", 
      value: "open_now",
      description: "Currently open for business"
    },
    { 
      label: "Open Weekends", 
      value: "open_weekends",
      description: "Saturday & Sunday"
    },
    { 
      label: "Open Late", 
      value: "open_late",
      description: "After 6 PM"
    },
    { 
      label: "Open Early", 
      value: "open_early",
      description: "Before 8 AM"
    },
    { 
      label: "24/7 Service", 
      value: "24_7",
      description: "Round-the-clock"
    },
    { 
      label: "Extended Hours", 
      value: "extended_hours",
      description: "10+ hours daily"
    },
  ];

  const handleHoursSelect = (hours: string) => {
    onOperatingHoursChange(hours);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operating Hours</Text>
      <View style={styles.optionsContainer}>
        {operatingHoursOptions.map((option, index) => (
          <View key={index} style={styles.optionCard}>
            <Checkbox 
              initialChecked={selectedHours.includes(option.value)}
              onChange={() => handleHoursSelect(option.value)}
            />
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>{option.label}</Text>
              <Text style={styles.descriptionText}>{option.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  optionsContainer: {
    gap: 8,
    backgroundColor: "#F5F5F5",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
    lineHeight: 20,
  },
  descriptionText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "400",
    lineHeight: 16,
  },
});

export default ShopOperatingHoursFilter; 