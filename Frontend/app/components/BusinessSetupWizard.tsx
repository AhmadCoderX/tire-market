import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { X } from "lucide-react-native";

interface BusinessSetupWizardProps {
  visible: boolean;
  onClose: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BusinessSetupWizard({ visible, onClose }: BusinessSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    shopName: '',
    shopAddress: '',
    services: [] as string[],
    businessHours: {} as Record<string, { isOpen: boolean, from: string, to: string }>,
  });
  const [newService, setNewService] = useState('');
  const [timezone, setTimezone] = useState('(UTC-09:00) Pacific Time');

  // Initialize business hours
  useState(() => {
    const initialHours = {};
    DAYS.forEach(day => {
      initialHours[day] = {
        isOpen: true,
        from: '09:00AM',
        to: '09:00AM'
      };
    });
    setBusinessData(prev => ({
      ...prev,
      businessHours: initialHours
    }));
  }, []);

  const handleAddService = () => {
    if (newService.trim()) {
      setBusinessData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setBusinessData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = {
          ...userData,
          accountType: 'business',
          shopName: businessData.shopName,
          shopAddress: businessData.shopAddress,
          services: businessData.services,
          businessHours: businessData.businessHours,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
      onClose();
    } catch (error) {
      console.error('Error saving business data:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Business Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Shop Name</Text>
              <TextInput
                style={styles.input}
                value={businessData.shopName}
                onChangeText={(text) => setBusinessData(prev => ({ ...prev, shopName: text }))}
                placeholder="Enter your shop name"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Shop Address</Text>
              <TextInput
                style={styles.input}
                value={businessData.shopAddress}
                onChangeText={(text) => setBusinessData(prev => ({ ...prev, shopAddress: text }))}
                placeholder="Enter your shop address"
                multiline
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Services</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newService}
                onChangeText={setNewService}
                placeholder="Add a service"
                onSubmitEditing={handleAddService}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.servicesList}>
              {businessData.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceText}>{service}</Text>
                  <TouchableOpacity onPress={() => handleRemoveService(index)}>
                    <X size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Business Hours</Text>
            <View style={styles.timezoneContainer}>
              <Text style={styles.label}>Timezone</Text>
              <TextInput
                style={styles.input}
                value={timezone}
                onChangeText={setTimezone}
                placeholder="Select your timezone"
              />
            </View>
            <ScrollView style={styles.hoursList}>
              {DAYS.map((day) => (
                <View key={day} style={styles.dayRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      businessData.businessHours[day]?.isOpen && styles.toggleButtonActive
                    ]}
                    onPress={() => setBusinessData(prev => ({
                      ...prev,
                      businessHours: {
                        ...prev.businessHours,
                        [day]: {
                          ...prev.businessHours[day],
                          isOpen: !prev.businessHours[day]?.isOpen
                        }
                      }
                    }))}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                  </TouchableOpacity>
                  <View style={styles.timeInputs}>
                    <TextInput
                      style={styles.timeInput}
                      value={businessData.businessHours[day]?.from}
                      onChangeText={(text) => setBusinessData(prev => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          [day]: { ...prev.businessHours[day], from: text }
                        }
                      }))}
                      placeholder="From"
                    />
                    <TextInput
                      style={styles.timeInput}
                      value={businessData.businessHours[day]?.to}
                      onChangeText={(text) => setBusinessData(prev => ({
                        ...prev,
                        businessHours: {
                          ...prev.businessHours,
                          [day]: { ...prev.businessHours[day], to: text }
                        }
                      }))}
                      placeholder="To"
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.stepsIndicator}>
            {[1, 2, 3].map((stepNumber) => (
              <View
                key={stepNumber}
                style={[
                  styles.stepIndicator,
                  step >= stepNumber && styles.stepIndicatorActive
                ]}
              >
                <Text style={styles.stepNumber}>Step {stepNumber}</Text>
              </View>
            ))}
          </View>

          {renderStep()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setStep(prev => prev - 1)}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {step < 3 ? (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => setStep(prev => prev + 1)}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleSave}
              >
                <Text style={styles.primaryButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... I'll provide the styles in the next message due to length
}); 