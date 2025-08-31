import React from 'react';
import { View, StyleSheet } from 'react-native';
import InteractiveChart from './InteractiveChart';

interface MarketplaceActivityProps {
  data: {
    active_listings: number;
    total_messages: number;
    total_reviews: number;
    new_users: number;
  };
}

const MarketplaceActivityChart: React.FC<MarketplaceActivityProps> = ({ data }) => {
  // Ensure we have a value for active_listings, default to 0 if undefined or null
  const activeListings = data?.active_listings ?? 0;
  
  const chartData = [
    { label: 'Active Listings', value: activeListings, color: '#16A34A' }, // Match greenish color from pie chart
    { label: 'Messages', value: data.total_messages, color: '#2563EB' }, // Keep the blue
    { label: 'Reviews', value: data.total_reviews, color: '#F59E0B' }, // Keep the amber
    { label: 'New Users', value: data.new_users, color: '#8B5CF6' }  // Keep the purple
  ];

  return (
    <View style={styles.container}>
      <InteractiveChart
        data={chartData}
        title="Marketplace Activity Overview"
        type="bar"
        showLegend={false}
        showTooltip={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 340, // Match height with the pie chart
  }
});

export default MarketplaceActivityChart; 