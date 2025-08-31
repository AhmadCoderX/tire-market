import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UpgradePopup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade Your Account</Text>
      <View style={styles.content}>
        {/* Add your upgrade options here */}
        <Text style={styles.description}>Choose a plan to upgrade your account</Text>
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

export default UpgradePopup; 