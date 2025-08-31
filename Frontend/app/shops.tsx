import React, { useState, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Header from "./header/Header";
import ShopFilterSidebar from "./shops/ShopFilterSidebar";
import ShopContent from "./shops/ShopContent";
import { getShops, Shop, ShopFilters } from "./services/api";

const ShopsPage = () => {
  const [filters, setFilters] = useState<ShopFilters>({});
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  
  // Determine if we're on mobile based on screen width
  const isMobile = width < 768;

  // Fetch shops data on component mount and when filters change
  useEffect(() => {
    fetchShops();
  }, [filters]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching shops with filters:', filters);
      
      const response = await getShops(filters);
      console.log('Shops fetched successfully:', response);
      
      setShops(response.results);
      if (response.results.length === 0) {
        setError('No shops found matching your criteria');
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
      setError('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchQuery: string, sellerType: string) => {
    console.log('Shop search triggered:', { query: searchQuery, sellerType });
    
    if (!searchQuery || !searchQuery.trim()) {
      // Clear search filter
      const newFilters = { ...filters };
      delete newFilters.search;
      setFilters(newFilters);
      return;
    }
    
    const newFilters = {
      ...filters,
      search: searchQuery.trim()
    };
    
    setFilters(newFilters);
  };

  const handleFilterChange = (newFilters: ShopFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Shop directory page"
    >
      <Header onSearch={handleSearch} onProfilePress={() => {}} currentPage="shops" />
      <View style={styles.mainContent}>
        {!isMobile && (
          <View style={styles.sidebarContainer}>
            <ShopFilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </View>
        )}
        <View style={[styles.contentSection, isMobile && styles.mobileContentSection]}>
          <ShopContent 
            shops={shops}
            loading={loading}
            error={error}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    display: "flex",
    flexDirection: "column",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  sidebarContainer: {
    width: "20%",
    height: "100%",
    zIndex: 1,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  contentSection: {
    width: "80%",
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
  },
  mobileContentSection: {
    width: "100%",
  },
});

export default ShopsPage; 