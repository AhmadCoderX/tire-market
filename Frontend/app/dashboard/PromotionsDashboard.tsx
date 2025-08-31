import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import TabNavigation from "./TabNavigation";
import PromotionCard from "./PromotionCard";

// Sample data for promotions
const promotionsData = [
  {
    id: "1",
    title: "Michelin Pilot Sport 4S - Set of 4",
    status: "Expired",
    price: "$899.99",
    period: "2024-02-15 to 2024-02-22",
    plan: "Basic",
  },
  {
    id: "2",
    title: "Bridgestone Blizzak WS90 - Winter Tires",
    status: "Expired",
    price: "$650.00",
    period: "2024-02-10 to 2024-02-24",
    plan: "Standard",
  },
  {
    id: "3",
    title: "Continental ExtremeContact DWS06 Plus",
    status: "Expired",
    price: "$720.00",
    period: "2024-01-15 to 2024-02-14",
    plan: "Premium",
  },
];

// Active promotions data
const activePromotionsData = [
  {
    id: "4",
    title: "Goodyear Eagle F1 Asymmetric 6",
    status: "Active",
    price: "$780.00",
    period: "2024-03-01 to 2024-04-01",
    plan: "Premium",
  },
  {
    id: "5",
    title: "Pirelli P Zero PZ4 - Performance Tires",
    status: "Active",
    price: "$950.00",
    period: "2024-03-10 to 2024-04-10",
    plan: "Premium Plus",
  },
  {
    id: "6",
    title: "Yokohama ADVAN Sport V105",
    status: "Active",
    price: "$720.00",
    period: "2024-02-25 to 2024-03-25",
    plan: "Standard",
  },
];

const PromotionsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "expired">("expired");

  const handleTabChange = (tab: "active" | "expired") => {
    setActiveTab(tab);
  };

  // Determine which promotions to display based on active tab
  const displayedPromotions =
    activeTab === "active" ? activePromotionsData : promotionsData;

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Promotions Dashboard"
    >
      <View style={styles.dashboard}>
        <Text style={styles.dashboardHeading}>User Dashboard</Text>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promotionsGrid}
          accessible={true}
          accessibilityLabel={`${activeTab === "active" ? "Active" : "Expired"} promotions scroll view`}
        >
          {displayedPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              title={promotion.title}
              status={promotion.status}
              price={promotion.price}
              period={promotion.period}
              plan={promotion.plan}
              onRenew={() => console.log(`Renew promotion: ${promotion.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboard: {
    padding: 20,
    backgroundColor: "#d9d7ce",
    fontFamily: "Inter",
  },
  dashboardHeading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    fontFamily: "Inter",
  },
  promotionsGrid: {
    flexDirection: "row",
    gap: 20,
    paddingBottom: 10,
    paddingRight: 10,
  },
});

export default PromotionsDashboard;
