import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ShopFilterOption from "./ShopFilterOption";
import ShopRatingFilter from "./ShopRatingFilter";
import ShopOperatingHoursFilter from "./ShopOperatingHoursFilter";
import { getServicesList } from "../services/api";

interface ShopFilters {
  services?: string[];
  rating_min?: number;
  operating_hours?: string[];
}

interface ShopFilterSidebarProps {
  filters: ShopFilters;
  onFilterChange: (filters: ShopFilters) => void;
}

const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [availableServices, setAvailableServices] = useState<Array<{label: string, value: string}>>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await getServicesList();
        
        // Convert services array to the format expected by ShopFilterOption
        const formattedServices = response.services.map(service => ({
          label: service,
          value: service
        }));
        
        setAvailableServices(formattedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to empty array if fetch fails
        setAvailableServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleServicesChange = (service: string) => {
    const currentServices = filters.services || [];
    let newServices: string[];
    
    if (currentServices.includes(service)) {
      newServices = currentServices.filter((s: string) => s !== service);
    } else {
      newServices = [...currentServices, service];
    }
    
    onFilterChange({ 
      ...filters, 
      services: newServices.length > 0 ? newServices : undefined 
    });
  };

  const handleRatingChange = (rating: number | undefined) => {
    onFilterChange({ 
      ...filters, 
      rating_min: rating 
    });
  };

  const handleOperatingHoursChange = (hours: string) => {
    const currentHours = filters.operating_hours || [];
    let newHours: string[];
    
    if (currentHours.includes(hours)) {
      newHours = currentHours.filter((h: string) => h !== hours);
    } else {
      newHours = [...currentHours, hours];
    }
    
    onFilterChange({ 
      ...filters, 
      operating_hours: newHours.length > 0 ? newHours : undefined 
    });
  };

  return (
    <View style={styles.sidebarWrapper}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ShopRatingFilter 
            selectedRating={filters.rating_min}
            onRatingChange={handleRatingChange}
          />
        </View>

        <View style={styles.section}>
          <ShopOperatingHoursFilter 
            selectedHours={filters.operating_hours || []}
            onOperatingHoursChange={handleOperatingHoursChange}
          />
        </View>

        <View style={styles.section}>
          <ShopFilterOption
            title="Services Offered"
            options={availableServices}
            selectedValues={filters.services}
            onSelect={handleServicesChange}
            multiSelect={true}
            loading={loadingServices}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarWrapper: {
    width: "100%",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingLeft: 20,
    backgroundColor: "#F5F5F5",
  },
});

export default ShopFilterSidebar; 