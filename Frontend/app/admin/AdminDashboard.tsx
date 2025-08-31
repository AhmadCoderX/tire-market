import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import TopNavBar from "./TopNavBar";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import ListingManagement from "./ListingManagement";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopNavBar />
        <View style={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <Sidebar
              activeItem={activeSection}
              onItemSelect={handleSectionChange}
            />
            <View style={styles.mainContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {activeSection === "dashboard" ? (
                  <DashboardContent />
                ) : activeSection === "listing" ? (
                  <ListingManagement />
                ) : null}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    fontFamily: "Arial",
  },
  container: {
    backgroundColor: "#F5F5F5",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 1234,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    width: "80%",
    paddingHorizontal: 20,
  },
});

export default AdminDashboard;
