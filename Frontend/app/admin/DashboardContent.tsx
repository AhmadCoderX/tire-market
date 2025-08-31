import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import DashboardHeader from "./DashboardHeader";
import StatCard from "./StatCard";
import UserTable from "./UserTable";
import MarketplaceActivityChart from "./MarketplaceActivityChart";
import { SellerPerformanceChart } from "./SellerPerformanceChart";
import { getAdminDashboardStats, AdminDashboardStats, ensureAbsoluteUrl, updateUserStatus } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  date_joined: string;
  last_login: string;
  status: string;
  profile_image_url: string;
}

interface DashboardContentProps {
  onViewListings?: (userId: string) => void;
  onViewReviews?: (userId: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  onViewListings,
  onViewReviews
}) => {
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          setError('No access token found');
          return;
        }

        // Fetch dashboard stats and users
        const [stats, usersResponse] = await Promise.all([
          getAdminDashboardStats(token),
          axios.get('http://127.0.0.1:8000/api/admin/users/', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Process user data to ensure profile images are correctly formatted
        const processedUsers = usersResponse.data.results.map((user: any) => {
          // Apply ensureAbsoluteUrl to profile_image_url if it exists
          if (user.profile_image_url) {
            try {
              // Import ensureAbsoluteUrl from ../services/api
              user.profile_image_url = ensureAbsoluteUrl(user.profile_image_url);
            } catch (error) {
              console.error('Error processing profile image URL:', error);
            }
          }
          return user;
        });

        // Log the active listings value specifically
        console.log('Dashboard stats before processing:', JSON.stringify(stats, null, 2));
        
        // Ensure active_listings is properly set in marketplace_activity
        if (stats && stats.marketplace_activity) {
          console.log('Active listings value from API:', stats.marketplace_activity.active_listings);
          
          if (stats.marketplace_activity.active_listings === undefined || 
              stats.marketplace_activity.active_listings === null) {
            stats.marketplace_activity.active_listings = 0;
          } else {
            // Convert to number if it's a string
            stats.marketplace_activity.active_listings = Number(stats.marketplace_activity.active_listings);
          }
          
          console.log('Active listings after processing:', stats.marketplace_activity.active_listings);
        }

        setDashboardStats(stats);
        setUsers(processedUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserUpdate = async (userId: string, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      // Use the updateUserStatus function from api.ts
      await updateUserStatus(userId, newStatus, token);

      // Refresh dashboard data after update
      const stats = await getAdminDashboardStats(token);
              const usersResponse = await axios.get('http://127.0.0.1:6000/api/admin/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardStats(stats);
      setUsers(usersResponse.data.results);

      // Show success message
      Alert.alert('Success', `User ${newStatus}ed successfully`);
    } catch (err) {
      console.error('Error updating user status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    }
  };

  const handleViewListings = async (userId: string) => {
    if (onViewListings) {
      onViewListings(userId);
    } else {
      console.log('View listings for user:', userId);
    }
  };

  const handleViewReviews = async (userId: string) => {
    if (onViewReviews) {
      onViewReviews(userId);
    } else {
      console.log('View reviews for user:', userId);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <DashboardHeader title="Dashboard Overview" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <DashboardHeader title="Dashboard Overview" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  // Transform API user data to match UserTable props
  const transformedUsers = users.map(user => ({
    id: user.id,
    avatar: user.profile_image_url ? { uri: user.profile_image_url } : require('../../assets/images/profile-placeholder.png'),
    name: user.username,
    email: user.email,
    registeredDate: new Date(user.date_joined).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    lastActive: new Date(user.last_login).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }),
    status: user.status.charAt(0).toUpperCase() + user.status.slice(1) as "Approved" | "Suspended" | "Banned",
  }));

  return (
    <View style={styles.container}>
      <DashboardHeader title="Dashboard Overview" />
      
      {/* Stat Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsWrapper}>
          <StatCard
            title="Total Users"
            value={dashboardStats?.user_stats.total_users.toString() || "0"}
            iconSource={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4a22d06322cf7897691cd66a7cea048a25b576309a753140ad302d2f24c62ec6"
            }}
          />
          <StatCard
            title="Active Users"
            value={dashboardStats?.user_stats.active_users.toString() || "0"}
            iconSource={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/b084873cfb9236a59cf27e3e54c302095c1dbcc3ebdf1cce7b3ce5474c0aaecd"
            }}
          />
          <StatCard
            title="New Users"
            value={dashboardStats?.user_stats.new_users.toString() || "0"}
            iconSource={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/2456fc8d13e39f97d859c58dda2f74777e929aff2cb806837de8c5fe97110088"
            }}
          />
        </View>
      </View>
      
      {/* Charts */}
      <View style={styles.chartsContainer}>
        <View style={styles.chartsWrapper}>
          <View style={styles.chartColumn}>
            <View style={styles.chartCard}>
              <MarketplaceActivityChart data={dashboardStats?.marketplace_activity || {
                active_listings: 0,
                total_messages: 0,
                total_reviews: 0,
                new_users: 0
              }} />
            </View>
          </View>
          <View style={styles.chartColumn}>
            <View style={styles.chartCard}>
              <SellerPerformanceChart data={dashboardStats?.seller_performance || {
                business: { total_users: 0, average_rating: 0 },
                individual: { total_users: 0, average_rating: 0 }
              }} />
            </View>
          </View>
        </View>
      </View>
      
      {/* User Table */}
      <View style={styles.tableContainer}>
        <UserTable 
          users={transformedUsers}
          onUserUpdate={handleUserUpdate}
          onViewListings={handleViewListings}
          onViewReviews={handleViewReviews}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  statsContainer: {
    marginTop: 16,
    width: "100%",
  },
  statsWrapper: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    marginBottom: 24,
  },
  chartsContainer: {
    marginBottom: 24,
  },
  chartsWrapper: {
    gap: 20,
    display: "flex",
    flexDirection: "row",
  },
  chartColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "48%",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tableContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1E293B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DashboardContent;
