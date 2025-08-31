import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, useWindowDimensions } from "react-native";
import { useProfile } from "../hooks/useProfile";

interface ContactDetailsProps {
  userData?: any;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ userData }) => {
  const { profileData: ownProfileData, loading, error } = useProfile();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Use the provided userData if available, otherwise use the profile data from the hook
  const profileData = userData || ownProfileData;
  
  // Determine if we're viewing a business user's profile
  const isBusinessUser = profileData?.is_business || false;

  if (loading && !userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5B7560" />
      </View>
    );
  }

  if (error && !userData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading contact details: {error}</Text>
      </View>
    );
  }

  // Check if we have any contact details to display
  const hasContactDetails = profileData?.phone || profileData?.email || profileData?.shop_address;

  return (
    <View
      style={[styles.container, isMobile && styles.containerMobile]}
      accessibilityRole="none"
      accessibilityLabel="Contact Details"
    >
      <View style={styles.content}>
        <Text style={[styles.title, isMobile && styles.titleMobile]} accessibilityRole="header">
          Contact Details
        </Text>
        {!hasContactDetails && !isBusinessUser && (
          <View style={styles.noContactContainer}>
            <Text style={styles.noContactText}>
              Contact details not available for this seller.
            </Text>
          </View>
        )}
        {!hasContactDetails && isBusinessUser && (
          <View style={styles.noContactContainer}>
            <Text style={styles.noContactText}>
              This business seller has not provided contact details.
            </Text>
          </View>
        )}
        {hasContactDetails && (
          <View style={styles.detailsContainer}>
            {profileData?.phone && (
              <View style={styles.detailRow}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b76d06e8ad324c8dc0e9cc6b956c5ed16f4d980b9583aef3f161d9745e503d7?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                  }}
                  style={styles.icon}
                  accessibilityLabel="Phone icon"
                />
                <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                  {profileData.phone}
                </Text>
              </View>
            )}
            {profileData?.email && (
              <View style={styles.detailRow}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4808a4694e4f21ae4a8e3322cba9b0ab1d1ffe32febe25eaaf814dbbf9841bfa?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                  }}
                  style={styles.icon}
                  accessibilityLabel="Email icon"
                />
                <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                  {profileData.email}
                </Text>
              </View>
            )}
            {profileData?.shop_address && (
              <View style={styles.detailRow}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/9e4d3d3e09eb3f5b1bbf13738093c94def53d45b585733eb5c1d64bef6508406?placeholderIfAbsent=true&apiKey=12d7f7129f4044a9bb76564f490dda4e",
                  }}
                  style={styles.icon}
                  accessibilityLabel="Location icon"
                />
                <Text style={styles.detailText} numberOfLines={2} ellipsizeMode="tail">
                  {profileData.shop_address}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: "100%",
  },
  containerMobile: {
    padding: 12,
  },
  content: {
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  titleMobile: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  icon: {
    width: 20,
    height: 20,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  errorContainer: {
    padding: 12,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    fontSize: 14,
  },
  noContactContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContactText: {
    color: '#666',
    fontSize: 14,
    fontFamily: "Arial",
    textAlign: 'center',
  },
});

export default ContactDetails;
