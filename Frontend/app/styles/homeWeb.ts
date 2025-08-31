import { StyleSheet } from 'react-native';

const primaryGreen = '#556B2F';
const borderColor = '#E0E0E0';

export const webStyles = StyleSheet.create({
  // Web-specific container styles
  webContainer: {
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
  },

  // Checkbox styles
  checkbox: {
    cursor: 'pointer',
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: borderColor,
    borderRadius: 4,
    marginRight: 8,
    transition: 'all 0.2s ease',
  },
  checkboxChecked: {
    backgroundColor: primaryGreen,
    borderColor: primaryGreen,
  },
  checkboxLabel: {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: primaryGreen,
    },
  },

  // Search dropdown styles
  searchDropdownWeb: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 9999,
    maxHeight: 300,
    overflowY: 'auto',
  },
  searchDropdownItem: {
    padding: '10px 15px',
    borderBottom: `1px solid ${borderColor}`,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#F5F5F5',
    },
  },

  // Product card styles
  productCardWeb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
  },

  // Star rating styles
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  star: {
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#E0E0E0',
  },

  // Filter section styles
  filterSectionWeb: {
    padding: 20,
    borderRight: `1px solid ${borderColor}`,
    minWidth: 250,
    backgroundColor: '#FFFFFF',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    cursor: 'pointer',
    ':hover': {
      color: primaryGreen,
    },
  },

  // Dropdown styles
  dropdownWeb: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 4,
    padding: '8px 12px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    ':hover': {
      borderColor: primaryGreen,
    },
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 9999,
  },
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#F5F5F5',
    },
  },

  // Button styles
  buttonWeb: {
    backgroundColor: primaryGreen,
    padding: '10px 20px',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#445624',
    },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0,
  },
});
