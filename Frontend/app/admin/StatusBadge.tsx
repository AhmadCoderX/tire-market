import React from "react";
import { View, Text, StyleSheet } from "react-native";

type StatusType = "Approved" | "Suspended" | "Banned";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Approved":
        return "#10B981";
      case "Suspended":
        return "#FFCC00";
      case "Banned":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: getStatusColor() }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default StatusBadge;
