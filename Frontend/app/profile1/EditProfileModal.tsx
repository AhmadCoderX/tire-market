import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadProfileImage, updateProfile } from '../services/api';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    shopName: string;
    shopAddress: string;
    businessHours: string;
    profileImage: string;
  };
  onSave: (data: any) => void;
  onFieldChange: (field: string, value: string) => void;
  isBusinessUser: boolean;
}

interface EditableField {
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  shopName: boolean;
  shopAddress: boolean;
  businessHours: boolean;
  profileImage: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialData,
  onSave,
  onFieldChange,
  isBusinessUser,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [formData, setFormData] = useState(initialData);
  const [editableFields, setEditableFields] = useState<EditableField>({
    name: false,
    email: false,
    phone: false,
    address: false,
    shopName: false,
    shopAddress: false,
    businessHours: false,
    profileImage: false,
  });
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData, value: string) => {
    setEditingValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field: keyof typeof formData) => {
    try {
      const newValue = editingValues[field];
      if (newValue !== undefined) {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }

        // Map the field names to match the API expectations
        const fieldMapping: Record<string, string> = {
          name: 'username',
          email: 'email',
          phone: 'phone',
          address: 'address',
          shopName: 'shop_name',
          shopAddress: 'shop_address',
          businessHours: 'business_hours',
          profileImage: 'profile_image_url'
        };

        // Prepare the data for the API
        const updateData: any = {
          [fieldMapping[field] || field]: newValue,
          // Always include is_business status to preserve it
          is_business: isBusinessUser
        };

        // If updating business-specific fields, ensure they're properly formatted
        if (field === 'businessHours' && typeof newValue === 'string') {
          try {
            // Try to parse as JSON if it's a string
            const parsedHours = JSON.parse(newValue);
            updateData.business_hours = parsedHours;
          } catch {
            // If parsing fails, keep the original string
            updateData.business_hours = newValue;
          }
        }

        // Make the API call to update the profile
        const response = await updateProfile(token, updateData);
        
        if (response) {
          const updatedFormData = { ...formData, [field]: newValue };
          setFormData(updatedFormData);
          onFieldChange(field, newValue);
          onSave(updatedFormData);
          
          // Clear the editing state
          setEditingValues(prev => {
            const { [field]: _, ...rest } = prev;
            return rest;
          });
          setEditableFields(prev => ({ ...prev, [field]: false }));
          
          Alert.alert('Success', 'Profile updated successfully');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = (field: keyof typeof formData) => {
    setEditingValues(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    setEditableFields(prev => ({ ...prev, [field]: false }));
  };

  const pickImage = async () => {
    try {
      // Request permission first (this is more relevant for mobile)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }

        // Show loading state
        Alert.alert(
          'Uploading...',
          'Please wait while we upload your image',
          [],
          { cancelable: false }
        );

        try {
          // Upload the image first
          const uploadResponse = await uploadProfileImage(token, result.assets[0].uri);
          console.log('Upload response:', uploadResponse);

          if (uploadResponse.image_url) {
            // Update the form data with the new image URL
            const updatedFormData = { 
              ...formData, 
              profileImage: uploadResponse.image_url 
            };
            setFormData(updatedFormData);
            
            // Save the changes with the new image URL
            onSave({
              ...updatedFormData,
              profile_image_url: uploadResponse.image_url // Add this to ensure it's included in the update
            });

            Alert.alert('Success', 'Profile image updated successfully');
          } else {
            throw new Error('No image URL received from server');
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Alert.alert(
            'Error',
            'Failed to upload image. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert(
        'Error',
        'Failed to update profile image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderField = (field: keyof typeof formData, label: string, changeText: string, isMultiline: boolean = false) => {
    const isEditing = editableFields[field];
    const currentValue = isEditing ? (editingValues[field] ?? formData[field]) : formData[field];

    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        {!isEditing ? (
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldValue, isMultiline && styles.multilineValue]} numberOfLines={isMultiline ? 3 : 1}>
              {currentValue}
            </Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => {
                setEditableFields(prev => ({ ...prev, [field]: true }));
                setEditingValues(prev => ({ ...prev, [field]: formData[field] }));
              }}
            >
              <Text style={styles.changeLinkText}>{changeText}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={[styles.input, isMultiline && styles.multilineInput]}
              value={currentValue}
              onChangeText={(text) => handleChange(field, text)}
              autoFocus
              multiline={isMultiline}
              numberOfLines={isMultiline ? 3 : 1}
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={() => handleCancel(field)}>
                <Text style={styles.cancelAction}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(field)}>
                <Text style={styles.saveAction}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, isMobile && styles.modalContentMobile]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={[styles.contentContainer, isMobile && styles.contentContainerMobile]}>
              {/* Left Section - Profile Image */}
              <View style={[styles.leftSection, isMobile && styles.leftSectionMobile]}>
                <Image
                  source={{ uri: formData.profileImage }}
                  style={[styles.profileImage, isMobile && styles.profileImageMobile]}
                />
                <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
                  <Text style={styles.editImageText}>Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Right Section - Form Fields */}
              <View style={[styles.rightSection, isMobile && styles.rightSectionMobile]}>
                {/* Basic fields for all users */}
                {renderField('name', 'NAME', 'Change name')}
                {renderField('email', 'EMAIL', 'Change email')}
                {renderField('phone', 'PHONE', 'Change phone')}
                {/* Only show address for regular users */}
                {!isBusinessUser && renderField('address', 'ADDRESS', 'Change address', true)}
                {/* Business-only fields */}
                {isBusinessUser && (
                  <>
                    {renderField('shopName', 'SHOP NAME', 'Change shop')}
                    {renderField('shopAddress', 'SHOP ADDRESS', 'Change address', true)}
                    {renderField('businessHours', 'BUSINESS HOURS', 'Change business hours', true)}
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalContentMobile: {
    width: '95%',
    maxHeight: '80%',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#64748B',
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    gap: 40,
  },
  contentContainerMobile: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    gap: 20,
  },
  leftSection: {
    alignItems: 'center',
    gap: 16,
    width: 150,
  },
  leftSectionMobile: {
    width: '100%',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
  },
  rightSectionMobile: {
    width: '100%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F1F5F9',
  },
  profileImageMobile: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    alignSelf: 'center',
  },
  editImageText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  fieldContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  multilineValue: {
    minHeight: 60,
  },
  changeButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  changeLinkText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 4,
    width: '100%',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  cancelAction: {
    color: '#EF4444',
    fontSize: 20,
    fontWeight: '500',
  },
  saveAction: {
    color: '#22C55E',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default EditProfileModal; 