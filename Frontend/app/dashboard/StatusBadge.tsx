import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Determine badge color based on status
  const getBadgeColor = () => {
    switch (status.toLowerCase()) {
      case "active":
        return "#75946a"; // Bright green for active
      case "expired":
        return "#75946a"; // The color from the design
      case "pending":
        return "#FFC107"; // Yellow for pending
      default:
        return "#75946a"; // Default color
    }
  };

  return (
    <View
      style={[styles.badge, { backgroundColor: getBadgeColor() }]}
      accessible={true}
      accessibilityLabel={`Status: ${status}`}
      accessibilityRole="text"
    >
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    paddingLeft: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Inter",
  },
});

export default StatusBadge;
