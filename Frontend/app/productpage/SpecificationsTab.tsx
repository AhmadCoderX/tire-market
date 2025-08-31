import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TireListing } from "../services/api";

type TabType = "specifications" | "description";

interface SpecificationsTabProps {
  listing: TireListing | null;
}

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ listing }) => {
  const [activeTab, setActiveTab] = useState<TabType>("specifications");

  //console.log('SpecificationsTab received listing:', JSON.stringify(listing, null, 2));

  const formatCondition = (condition: string | undefined) => {
    if (!condition) return "Loading...";
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const specifications = [
    { label: "Brand", value: listing?.brand || "Loading..." },
    { label: "Model", value: listing?.model || "Loading..." },
    { label: "Type", value: listing?.tire_type?.replace(/_/g, ' ') || "Loading..." },
    { label: "Size", value: listing ? `${listing.width}/${listing.aspect_ratio}R${listing.diameter}` : "Loading..." },
    { label: "Load Index", value: listing?.load_index?.toString() || "Loading..." },
    { label: "Speed Rating", value: listing?.speed_rating || "Loading..." },
    { label: "Tread Depth", value: listing?.tread_depth ? `${parseFloat(listing.tread_depth.toString()).toFixed(2)}mm` : "Loading..." },
    { label: "Mileage", value: listing?.mileage ? `${listing.mileage.toLocaleString()} miles` : "0 miles" },
    { label: "Quantity", value: listing?.quantity?.toString() || "Loading..." },
    { label: "Condition", value: formatCondition(listing?.condition) },
  ];

  console.log('Processed specifications:', specifications);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "specifications" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("specifications")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "specifications" }}
        >
          <Text style={[styles.tabText, activeTab === "specifications" && styles.activeTabText]}>
            Specifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "description" && styles.activeTab]}
          onPress={() => setActiveTab("description")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "description" }}
        >
          <Text style={[styles.tabText, activeTab === "description" && styles.activeTabText]}>
            Description
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content} accessibilityRole="none">
        {activeTab === "specifications" && (
          <View style={styles.specContainer}>
            {specifications.map((spec, index) => (
              <View key={index} style={styles.specGroup}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
                {index % 2 === 0 && index < specifications.length - 1 && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>{specifications[index + 1].label}</Text>
                    <Text style={styles.specValue}>{specifications[index + 1].value}</Text>
                  </View>
                )}
              </View>
            )).filter((_, i) => i % 2 === 0)}
          </View>
        )}

        {activeTab === "description" && (
          <Text style={styles.descriptionText}>
            {listing?.description || "No description available."}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  tabs: {
    flexDirection: "row",
    gap: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingBottom: 8,
  },
  tab: {
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#5B7560",
  },
  tabText: {
    color: "#A1A1AA",
    fontSize: 15,
  },
  activeTabText: {
    color: "#5B7560",
    fontWeight: "500",
  },
  content: {
    marginTop: 20,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  specContainer: {
    gap: 24,
  },
  specGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  specItem: {
    flex: 1,
  },
  specRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  specLabel: {
    color: "#344E41",
    fontSize: 12,
    marginBottom: 8,
  },
  specValue: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "500",
  },
  descriptionText: {
    color: "#09090B",
    fontSize: 12,
    lineHeight: 24,
  },
});

export default SpecificationsTab;