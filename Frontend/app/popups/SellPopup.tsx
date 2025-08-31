import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SellPopup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Listing</Text>
      <View style={styles.content}>
        {/* Add your sell form components here */}
        <Text style={styles.description}>Create a new listing to sell your tires</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333333',
    fontFamily: 'Arial',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Arial',
  },
});

export default SellPopup; 