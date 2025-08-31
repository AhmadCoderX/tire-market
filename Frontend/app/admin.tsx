import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import TopNavBar from "./header/Header";
import Sidebar from "./admin/Sidebar";
import DashboardContent from "./admin/DashboardContent";
import ListingManagement from "./admin/ListingManagement";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleViewUserListings = async (userId: string) => {
    try {
      // Store the scroll target in AsyncStorage
      await AsyncStorage.setItem('profileDetailsScrollTarget', 'listings');
      
      // Navigate to the profileDetails page with the userId parameter
      router.push({
        pathname: "/profileDetails",
        params: { userId: userId }
      });
    } catch (error) {
      console.error('Error navigating to user listings:', error);
    }
  };

  const handleViewUserReviews = async (userId: string) => {
    try {
      // Store the scroll target and tab selection in AsyncStorage
      await AsyncStorage.setItem('profileDetailsScrollTarget', 'reviews');
      await AsyncStorage.setItem('profileDetailsActiveTab', 'reviews');
      
      // Navigate to the profileDetails page with the userId parameter
      router.push({
        pathname: "/profileDetails",
        params: { userId: userId }
      });
    } catch (error) {
      console.error('Error navigating to user reviews:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopNavBar onSearch={() => {}} />
        <View style={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <Sidebar activeItem={activeSection} onItemSelect={handleSectionChange} />
            <View style={styles.mainContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {activeSection === "dashboard" ? (
                  <DashboardContent 
                    onViewListings={handleViewUserListings}
                    onViewReviews={handleViewUserReviews}
                  />
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
    paddingLeft: 0,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    marginLeft: -20, // Increased negative margin from -15 to -20
  },
  mainContent: {
    flex: 1,
    width: "86%", // Increased from 85% to 86% to match the sidebar width change
    paddingLeft: 30, // Increased padding to compensate for the sidebar moving further left
    paddingRight: 20,
  },
})

export default AdminDashboard

