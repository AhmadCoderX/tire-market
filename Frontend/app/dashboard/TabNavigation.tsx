import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TabNavigationProps {
  activeTab: "active" | "expired";
  onTabChange: (tab: "active" | "expired") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "active" && styles.activeTab]}
        onPress={() => onTabChange("active")}
        accessible={true}
        accessibilityLabel="Active Promotions Tab"
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "active" }}
      >
        <Text style={styles.tabText}>Active Promotions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "expired" && styles.activeTab]}
        onPress={() => onTabChange("expired")}
        accessible={true}
        accessibilityLabel="Expired Promotions Tab"
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === "expired" }}
      >
        <Text style={styles.tabText}>Expired Promotions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  tab: {
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderRadius: 4,
    borderBottomColor: "white",
    backgroundColor: "white",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Inter",
  },
});

export default TabNavigation;
