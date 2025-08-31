import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ShopGrid from "./ShopGrid";
import ShopAdBanner from "./ShopAdBanner";
import { Shop } from "../services/api";

interface ShopContentProps {
  shops: Shop[];
  loading?: boolean;
  error?: string | null;
}

const ShopContent: React.FC<ShopContentProps> = ({
  shops,
  loading = false,
  error = null,
}) => {
  return (
    <View style={styles.container}>
      {/* Compact Header Bar */}
      <View style={styles.compactHeader}>
        <Text style={styles.resultsText}>{shops.length} shops found</Text>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Text style={styles.sortValue}>Distance</Text>
        </View>
      </View>

      {/* Shop Grid Section */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <ShopAdBanner onPress={() => console.log('Shop ad clicked - could navigate to shop service page')} />
        <ShopGrid 
          shops={shops}
          loading={loading}
          error={error}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  compactHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Inter",
  },
  sortValue: {
    color: "#3A593F",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

export default ShopContent; 