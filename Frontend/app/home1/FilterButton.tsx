import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const isSmallScreen = Dimensions.get('window').width < 768;

interface FilterButtonProps {
  onPress: () => void;
  filterCount?: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onPress, filterCount = 0 }) => {
  return (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <MaterialIcons name="filter-list" size={isSmallScreen ? 12 : 20} color="#5B7560" />
      <Text style={styles.filterText}>Filter</Text>
      {filterCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: isSmallScreen ? 2 : 10,
    paddingHorizontal: isSmallScreen ? 4 : 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5B7560',
    height: isSmallScreen ? 32 : 48,
    justifyContent: 'center',
    ...(isSmallScreen
      ? { flex: 0.48, minWidth: 0 }
      : { width: 200, minWidth: 120 }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    marginLeft: 4,
    color: '#5B7560',
    fontSize: isSmallScreen ? 11 : 14,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#5B7560',
    borderRadius: 10,
    minWidth: isSmallScreen ? 12 : 16,
    height: isSmallScreen ? 12 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 7 : 12,
    fontWeight: 'bold',
  },
});

export default FilterButton; 