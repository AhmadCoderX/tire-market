import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TabOption {
  id: string;
  label: string;
}

interface TabSelectorProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabContainer} accessibilityRole="tablist">
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.tabButton,
            activeTab === option.id && styles.activeTabButton,
          ]}
          onPress={() => onTabChange(option.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === option.id }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === option.id && styles.activeTabText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    minHeight: 36,
    width: "100%",
    gap: 16,
    flexWrap: "wrap",
  },
  tabButton: {
    alignSelf: "stretch",
    paddingBottom: 4,
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#5B7560",
  },
  tabText: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 32,
    color: "#969696",
  },
  activeTabText: {
    color: "#5B7560",
  },
});

export default TabSelector;
