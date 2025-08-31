import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ActionButtonsProps {
  sellerId?: string;
  sellerName?: string;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: string;
  listingImage?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ sellerId, sellerName, listingId, listingTitle, listingPrice, listingImage }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMessagePress = async () => {
    if (!sellerId) {
      console.error("No seller ID provided");
      return;
    }

    try {
      // Check if user is logged in
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2500);
        // Fallback Alert for mobile or accessibility
        if (isMobile) {
          Alert.alert(
            "Login Required", 
            "You need to login to message the seller.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Login", 
                onPress: () => router.push({
                  pathname: "/login",
                  params: { returnToProfile: 'true' }
                })
              }
            ]
          );
        }
        return;
      }

      // Navigate to chat with the seller ID
      router.push({
        pathname: "/chat",
        params: { sellerId, sellerName, listingId, listingTitle, listingPrice, listingImage }
      });
    } catch (error) {
      console.error("Error handling message press:", error);
    }
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Tooltip for not signed in */}
      {showTooltip && !isMobile && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>Please sign in to message the seller.</Text>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.messageButton,
          isMobile && styles.messageButtonMobile
        ]}
        accessibilityLabel="Message seller"
        accessibilityRole="button"
        onPress={handleMessagePress}
      >
        <Text style={styles.messageText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 0,
  },
  containerMobile: {
    paddingHorizontal: 12,
  },
  messageButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#3A593F",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 300,
    maxWidth: 400,
  },
  messageButtonMobile: {
    width: "100%",
    padding: 12,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  tooltip: {
    position: 'absolute',
    top: -38,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ActionButtons;
