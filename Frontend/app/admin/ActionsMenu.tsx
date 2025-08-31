import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Alert } from 'react-native';

interface ActionsMenuProps {
  userId: string;
  currentStatus: string;
  onAction: (action: string, userId: string) => Promise<void>;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ userId, currentStatus, onAction }) => {
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

      // If menu would go off bottom of screen, show it above the button instead
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
    try {
      setIsLoading(true);
      console.log('ActionsMenu handleAction called:', action, userId);
      await onAction(action, userId);
      setIsVisible(false);
      
    } catch (error) {
      console.error('Error performing action:', error);
      Alert.alert('Error', 'Failed to perform action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = () => {
    switch (currentStatus.toLowerCase()) {
      case 'approved':
        return [
          { label: 'Suspend User', action: 'suspend', style: styles.warningAction },
          { label: 'Ban User', action: 'ban', style: styles.dangerAction },
          { label: 'View Listings', action: 'viewListings', style: styles.normalAction },
          { label: 'View Reviews', action: 'viewReviews', style: styles.normalAction },
        ];
      case 'suspended':
        return [
          { label: 'Reactivate User', action: 'approve', style: styles.successAction },
          { label: 'Ban User', action: 'ban', style: styles.dangerAction },
          { label: 'View Listings', action: 'viewListings', style: styles.normalAction },
        ];
      case 'banned':
        return [
          { label: 'Reactivate User', action: 'approve', style: styles.successAction },
          { label: 'View Listings', action: 'viewListings', style: styles.normalAction },
        ];
      default:
        return [];
    }
  };

  return (
    <View>
      <TouchableOpacity 
        ref={buttonRef}
        onPress={handleShowMenu}
        style={styles.actionButton}
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
                  action.style === styles.warningAction && styles.warningText,
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
    color: '#666',
    textAlign: 'center',
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
  normalAction: {
    backgroundColor: '#f8f9fa',
  },
  dangerAction: {
    backgroundColor: '#fff5f5',
  },
  warningAction: {
    backgroundColor: '#fff9db',
  },
  successAction: {
    backgroundColor: '#f6fff8',
  },
  dangerText: {
    color: '#e03131',
  },
  warningText: {
    color: '#e67700',
  },
  successText: {
    color: '#2f9e44',
  },
});

export default ActionsMenu; 