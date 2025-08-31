import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Alert } from 'react-native';

interface ListingActionsMenuProps {
  listingId: string;
  isActive: boolean;
  onAction: (action: string, listingId: string) => Promise<void>;
}

const ListingActionsMenu: React.FC<ListingActionsMenuProps> = ({ listingId, isActive, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, showAbove: false });
  const buttonRef = useRef<View>(null);

  const handleShowMenu = () => {
    buttonRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      const menuWidth = 200; // Width of menu from styles
      const menuHeight = getAvailableActions().length * 50; // Approximate height per item
      const horizontalOffset = 8;
      const verticalOffset = 4;

      // Check horizontal overflow
      let xPosition = px + horizontalOffset;
      if (px + menuWidth > screenWidth) {
        xPosition = px - menuWidth + width - horizontalOffset;
      }

      // Check vertical overflow
      let yPosition = py + height + verticalOffset;
      let showAbove = false;

      if (py + height + menuHeight + verticalOffset > screenHeight) {
        yPosition = py - menuHeight - verticalOffset;
        showAbove = true;
      }

      setMenuPosition({
        x: xPosition,
        y: yPosition,
        showAbove
      });
      setIsVisible(true);
    });
  };

  const handleAction = async (action: string) => {
    console.log('ListingActionsMenu handleAction called with:', action);
    try {
      setIsLoading(true);
      console.log('Calling onAction with:', action, listingId);
      await onAction(action, listingId);
      console.log('onAction completed');
      setIsVisible(false);
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = () => {
    if (isActive) {
      return [
        { label: 'Unlist Listing', action: 'unlist', style: styles.dangerAction },
        // Add more actions for active listings here as needed
      ];
    } else {
      return [
        { label: 'Reactivate Listing', action: 'reactivate', style: styles.successAction },
        // Add more actions for unlisted listings here as needed
      ];
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={buttonRef}
        onPress={handleShowMenu}
        style={styles.actionButton}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>•••</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View 
            style={[
              styles.menuContainer,
              {
                position: 'absolute',
                left: menuPosition.x,
                top: menuPosition.y,
              },
              menuPosition.showAbove && styles.menuAbove
            ]}
          >
            {getAvailableActions().map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, action.style]}
                onPress={() => handleAction(action.action)}
                disabled={isLoading}
              >
                <Text style={[
                  styles.menuItemText,
                  action.style === styles.dangerAction && styles.dangerText,
                  action.style === styles.successAction && styles.successText,
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 20,
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuAbove: {
    shadowOffset: { width: 0, height: -2 },
  },
  menuItem: {
    padding: 12,
    borderRadius: 4,
    marginVertical: 2,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  dangerAction: {
    backgroundColor: '#fff5f5',
  },
  dangerText: {
    color: '#e03131',
  },
  successAction: {
    backgroundColor: '#f5fff5',
  },
  successText: {
    color: '#2b8a3e',
  },
});

export default ListingActionsMenu; 