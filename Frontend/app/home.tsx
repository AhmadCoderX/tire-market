import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text, useWindowDimensions, Platform, TouchableOpacity } from "react-native";
import Header from "./header/Header";
import FilterSidebar from "./home1/FilterSidebar";
import ProductGrid from "./home1/ProductGrid";
import SortByDropdown from "./home1/SortByDropdown";
import FilterModal from "./home1/FilterModal";
import AdBanner from "./home1/AdBanner";
import { getListings } from "./services/api";
import { FilterParams, TireListingResponse } from "./types";
import { debounce } from 'lodash';
import { FONTS, FONT_STYLES } from './constants/fonts';

const MacBookAir39 = () => {
  // Initialize with newest as default sort
  const [filters, setFilters] = useState<FilterParams>({
    sort_by: "newest"
  });
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { width } = useWindowDimensions();
  
  // Determine if we're on mobile based on screen width
  const isMobile = width < 768;

  const fetchListings = async (currentFilters: FilterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a large page_size to show all listings at once
      const filtersWithLargePageSize = {
        ...currentFilters,
        page_size: 100  // Request a large number to effectively disable pagination
      };
      
      console.log('Fetching listings with filters:', filtersWithLargePageSize);
      const response = await getListings(filtersWithLargePageSize);
      console.log('Received listings response:', response);
      
      if (response && Array.isArray(response.results)) {
        // Use listings directly from the API as they're already sorted with promoted listings first
        setListings(response.results);
        if (response.results.length === 0) {
          setError('No listings found matching your criteria');
        }
      } else {
        console.error('Invalid response format:', response);
        setError('Error loading listings');
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of fetchListings with a shorter delay for search
  const debouncedFetchListings = useCallback(
    debounce((filters: FilterParams) => {
      fetchListings(filters);
    }, 300),
    []
  );

  useEffect(() => {
    console.log('Filters changed:', filters);
    if (Object.keys(filters).length > 0) {
    fetchListings(filters);
    }
  }, [filters]);

  const handleSearch = async (searchQuery: string, sellerType: string) => {
    // If search is empty, reset to initial state with just sort_by
    if (!searchQuery || !searchQuery.trim()) {
      const resetFilters = {
        sort_by: "newest"
      };
      console.log('Search cleared, resetting filters to:', resetFilters);
      setFilters(resetFilters);
      return;
    }
    
    // Otherwise, apply search with selected filters
    const newFilters = {
      ...filters,
      search: searchQuery.trim(),
      seller_type: sellerType.toLowerCase()
    };
    
    console.log('Search triggered:', { query: searchQuery, sellerType });
    console.log('New filters after search:', newFilters);
    setFilters(newFilters);
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy
    }));
  };

  const handleFilterButtonPress = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  // Calculate the number of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.condition && filters.condition.length > 0) count++;
    if (filters.quantity && filters.quantity.length > 0) count++;
    if (filters.brand && filters.brand.length > 0) count++;
    if (filters.price_min || filters.price_max) count++;
    if (filters.width || filters.aspect_ratio || filters.diameter) count++;
    if (filters.tread_depth_min || filters.tread_depth_max) count++;
    if (filters.vehicle_type && filters.vehicle_type.length > 0) count++;
    if (filters.tire_type && filters.tire_type.length > 0) count++;
    if (filters.rating_min) count++;
    if (filters.seller_type) count++;
    if (filters.speed_rating && filters.speed_rating.length > 0) count++;
    if (filters.load_index && filters.load_index.length > 0) count++;
    return count;
  };

  const resultsHeader = (
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsText}>
        {loading ? 'Loading...' : `${listings.length} listings found`}
      </Text>
      <View style={styles.resultsControls}>
        {/* Mobile controls */}
        {isMobile && (
          <>
            <TouchableOpacity 
              style={[styles.mobileButton, { marginRight: 8 }]}
              onPress={handleFilterButtonPress}
            >
              <Text style={styles.mobileButtonText}>Filter</Text>
              {getActiveFilterCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <SortByDropdown 
              currentSort={filters.sort_by}
              onSortChange={handleSortChange}
            />
          </>
        )}
        
        {/* Desktop controls */}
        {!isMobile && (
          <SortByDropdown 
            currentSort={filters.sort_by}
            onSortChange={handleSortChange}
          />
        )}
      </View>
    </View>
  );

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="E-commerce marketplace page"
    >
      <Header onSearch={handleSearch} onProfilePress={() => {}} currentPage="tires" />
      <View style={styles.mainContent}>
        {!isMobile && (
          <View style={styles.sidebarContainer}>
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </View>
        )}
        <View style={[styles.productsSection, isMobile && styles.mobileProductsSection]}>
          {resultsHeader}
          
          <ScrollView 
            style={styles.productScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {/* Advertisement Banner */}
            <AdBanner onPress={() => console.log('Ad clicked - could navigate to advertiser page')} />
            
            <ProductGrid 
              listings={listings} 
              loading={loading} 
              error={error}
            />
          </ScrollView>
        </View>
      </View>

      {/* Mobile Filter Modal */}
      {isMobile && (
        <FilterModal
          visible={showFilterModal}
          onClose={handleCloseFilterModal}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
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
    zIndex: 1, // Lower z-index than the product container
  },
  productsSection: {
    width: "80%",
    flexDirection: "column",
  },
  mobileProductsSection: {
    width: "100%",
  },
  sortContainer: {
    padding: 16,
    paddingBottom: 0,
    zIndex: 100,
    alignItems: "flex-end",
    marginRight: 44,
  },
  mobileSortContainer: {
    padding: 10,
    paddingBottom: 0,
    zIndex: 100,
    alignItems: "flex-start",
    marginRight: 0,
  },
  mobileControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  productsContainer: {
    flex: 1,
    zIndex: 10, // Higher z-index than sidebar but lower than dropdowns
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    fontFamily: "Inter",
    position: "relative",
    zIndex: 100,
  },
  resultsText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    letterSpacing: 0,
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Inter",
  },
  resultsControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
    zIndex: 1000,
  },
  mobileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  mobileButtonText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  filterBadge: {
    backgroundColor: "#FF5757",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 4,
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
  },
  productScrollView: {
    flex: 1,
    zIndex: 10, // Higher z-index than sidebar but lower than dropdowns
  },
});

export default MacBookAir39;