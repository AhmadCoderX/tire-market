import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

interface PricingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isVerySmallScreen = width < 400;

  const handleUpgrade = () => {
    router.push('/newdetails');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isSmallScreen && styles.modalContentMobile]}>
          <Text style={[styles.title, isSmallScreen && styles.titleMobile]}>Upgrade to Business Account</Text>
          <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
            Unlock premium features and grow your business
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, isSmallScreen && styles.benefitTextMobile]}>• Enhanced visibility in search results</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, isSmallScreen && styles.benefitTextMobile]}>• Access to business analytics</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, isSmallScreen && styles.benefitTextMobile]}>• Priority customer support</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={[styles.benefitText, isSmallScreen && styles.benefitTextMobile]}>• Verified business badge</Text>
            </View>
          </View>

          <View style={[styles.buttonContainer, isSmallScreen && styles.buttonContainerMobile]}>
            <TouchableOpacity
              style={[styles.upgradeButton, isSmallScreen && styles.upgradeButtonMobile]}
              onPress={handleUpgrade}
            >
              <Text style={[styles.upgradeButtonText, isSmallScreen && styles.upgradeButtonTextMobile]}>Upgrade Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, isSmallScreen && styles.cancelButtonMobile]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, isSmallScreen && styles.cancelButtonTextMobile]}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    width: 480,
    maxWidth: '90%',
    alignItems: 'center',
  },
  modalContentMobile: {
    width: '80%',
    padding: 12,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleMobile: {
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  descriptionMobile: {
    fontSize: 12,
    marginBottom: 4,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  benefitTextMobile: {
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  buttonContainerMobile: {
    gap: 4,
    marginTop: 8,
  },
  upgradeButton: {
    backgroundColor: '#3A593F',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonMobile: {
    paddingVertical: 6,
    borderRadius: 4,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeButtonTextMobile: {
    fontSize: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonMobile: {
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonTextMobile: {
    fontSize: 12,
  },
});

export default PricingModal; 