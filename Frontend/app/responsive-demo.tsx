import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ResponsiveExample } from './components/responsive';

const ResponsiveDemo = () => {
  return (
    <View style={styles.container}>
      <ResponsiveExample />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default ResponsiveDemo; 