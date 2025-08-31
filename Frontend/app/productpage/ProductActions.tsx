import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProductActions = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.messageButton} onPress={() => {}}>
        <Text style={styles.messageText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#4F6C46',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ProductActions;
