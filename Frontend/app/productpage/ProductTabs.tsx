import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProductSpecifications from "./ProductSpecifications";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("specifications");

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "specifications" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("specifications")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "specifications" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "specifications" && styles.activeTabText,
            ]}
          >
            Specifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "description" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("description")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "description" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "description" && styles.activeTabText,
            ]}
          >
            Description
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === "specifications" && <ProductSpecifications />}
        {activeTab === "description" && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Detailed product description would go here. The Michelin Pilot
              Sport 4S is a high-performance summer tire designed for sports
              cars and performance sedans.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 16,
    minHeight: 36,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingBottom: 8,
  },
  activeTabButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#5B7560",
  },
  tabText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 32,
    color: "#969696",
  },
  activeTabText: {
    color: "#5B7560",
  },
  tabContent: {
    marginTop: 16,
  },
  descriptionContainer: {
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    padding: 16,
  },
  descriptionText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "#344E41",
    lineHeight: 22,
  },
});

export default ProductTabs;
