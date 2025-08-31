import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StatusBadge from "./StatusBadge";

interface PromotionCardProps {
  title: string;
  status: string;
  price: string;
  period: string;
  plan: string;
  onRenew: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  title,
  status,
  price,
  period,
  plan,
  onRenew,
}) => {
  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityLabel={`Promotion for ${title}`}
      accessibilityRole="header"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <StatusBadge status={status} />
      </View>

      <Text style={styles.price}>{price}</Text>

      <Text style={styles.details}>Promotion period: {period}</Text>

      <Text style={styles.plan}>Plan: {plan}</Text>

      <TouchableOpacity
        style={styles.renewButton}
        onPress={onRenew}
        accessible={true}
        accessibilityLabel={`Renew promotion for ${title}`}
        accessibilityRole="button"
      >
        <Text style={styles.renewButtonText}>Renew Promotion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "column",
    gap: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 8,
    fontFamily: "Inter",
  },
  price: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    fontFamily: "Inter",
  },
  details: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Inter",
  },
  plan: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Inter",
  },
  renewButton: {
    backgroundColor: "#75946a",
    padding: 12,
    borderRadius: 6,
    marginTop: "auto",
    alignItems: "center",
  },
  renewButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter",
    textAlign: "center",
  },
});

export default PromotionCard;
