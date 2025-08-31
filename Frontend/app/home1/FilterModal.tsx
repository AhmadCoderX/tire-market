import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, SafeAreaView, Dimensions } from 'react-native';
import FilterSidebar from './FilterSidebar';
import { FilterParams } from '../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const isSmallScreen = Dimensions.get('window').width < 768;

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FilterSidebar 
              filters={filters}
              onFilterChange={onFilterChange}
            />
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => onFilterChange({ sort_by: filters.sort_by })}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={onClose}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: isSmallScreen ? '75%' : '60%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    height: isSmallScreen ? 32 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#5B7560',
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#5B7560',
    fontSize: isSmallScreen ? 11 : 14,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    height: isSmallScreen ? 32 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B7560',
    borderRadius: 4,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 11 : 14,
    fontWeight: '500',
  },
});

export default FilterModal; 