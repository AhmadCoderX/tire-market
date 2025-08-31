import React from "react";
import { View, StyleSheet, ActivityIndicator, Text, useWindowDimensions } from "react-native";
import ShopCard from "./ShopCard";
import { Shop } from "../services/api";

interface ShopGridProps {
  shops: Shop[];
  loading: boolean;
  error?: string | null;
}

const ShopGrid: React.FC<ShopGridProps> = ({ shops, loading, error }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width < 1024 && width >= 768;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5B7560" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.noShopsText}>No shops found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.grid,
        isMobile && styles.mobileGrid,
        isTablet && styles.tabletGrid
      ]}>
        {shops.map((shop) => (
          <View key={shop.id} style={[
            styles.cardWrapper,
            isMobile && styles.mobileCardWrapper,
            isTablet && styles.tabletCardWrapper
          ]}>
            <ShopCard shop={shop} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    padding: 16,
    justifyContent: "flex-start",
    zIndex: 1,
  },
  mobileGrid: {
    gap: 10,
    padding: 10,
  },
  tabletGrid: {
    gap: 12,
    padding: 12,
  },
  cardWrapper: {
    width: "32%",
    marginBottom: 15,
  },
  mobileCardWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  tabletCardWrapper: {
    width: "48%",
    marginBottom: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  noShopsText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ShopGrid; 