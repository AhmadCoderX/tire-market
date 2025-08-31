import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, SafeAreaView, ScrollView, Modal, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import GridComponent from "./Gridcomponent"; // Import GridComponent
import { ChevronDown, Check } from 'lucide-react-native';
import { updateBusinessProfile } from './services/api';
import SuccessPopup from './components/SuccessPopup';

interface BusinessHours {
  [key: string]: { isOpen: boolean, from: string, to: string };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PREDEFINED_SERVICES = [
  'Tire Installation',
  'Wheel Alignment',
  'Tire Balancing',
  'Tire Repair',
  'Tire Rotation',
  'Flat Tire Repair',
  'Tire Pressure Check',
  'Wheel Mounting',
  'Tire Disposal',
  'Emergency Roadside Service',
  'Tire Inspection',
  'Nitrogen Inflation',
  'Tire Storage',
  'Seasonal Tire Change',
  'TPMS Service'
];

const TIME_ZONES = [
  { label: '(UTC-12:00) International Date Line West', value: 'UTC-12:00' },
  { label: '(UTC-11:00) Coordinated Universal Time-11', value: 'UTC-11:00' },
  { label: '(UTC-10:00) Hawaii', value: 'UTC-10:00' },
  { label: '(UTC-09:00) Alaska', value: 'UTC-09:00' },
  { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'UTC-08:00' },
  { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'UTC-07:00' },
  { label: '(UTC-06:00) Central Time (US & Canada)', value: 'UTC-06:00' },
  { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'UTC-05:00' },
  { label: '(UTC-04:00) Atlantic Time (Canada)', value: 'UTC-04:00' },
  { label: '(UTC-03:00) Brasilia', value: 'UTC-03:00' },
  { label: '(UTC-02:00) Coordinated Universal Time-02', value: 'UTC-02:00' },
  { label: '(UTC-01:00) Cape Verde Is.', value: 'UTC-01:00' },
  { label: '(UTC+00:00) London', value: 'UTC+00:00' },
  { label: '(UTC+01:00) Paris', value: 'UTC+01:00' },
  { label: '(UTC+02:00) Helsinki', value: 'UTC+02:00' },
  { label: '(UTC+03:00) Moscow', value: 'UTC+03:00' },
  { label: '(UTC+04:00) Dubai', value: 'UTC+04:00' },
  { label: '(UTC+05:00) Islamabad', value: 'UTC+05:00' },
  { label: '(UTC+06:00) Dhaka', value: 'UTC+06:00' },
  { label: '(UTC+07:00) Bangkok', value: 'UTC+07:00' },
  { label: '(UTC+08:00) Beijing', value: 'UTC+08:00' },
  { label: '(UTC+09:00) Tokyo', value: 'UTC+09:00' },
  { label: '(UTC+10:00) Sydney', value: 'UTC+10:00' },
  { label: '(UTC+11:00) Solomon Is.', value: 'UTC+11:00' },
  { label: '(UTC+12:00) Auckland', value: 'UTC+12:00' },
];

const TIME_OPTIONS = [
  '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
  '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM',
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
];

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 800; // Threshold for small screens

const getStyles = (step: number) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  formContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    marginTop: 0,
  },
  formBox: {
    width: '100%',
    maxWidth: step === 3 ? 500 : 500,
    backgroundColor: '#EBEDEC',
    padding: 16,
    borderRadius: 12,
    marginTop: 0,
    alignSelf: 'center',
  },
  stepsIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  stepIndicator: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 20 },
  stepText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  stepTitle: { fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3A5A40',
    marginBottom: 24,
  },
  pickerContainer: { marginBottom: 24 },
  pickerLabel: { fontSize: 16, color: '#3A5A40', marginBottom: 8 },
  picker: { width: '100%', height: 40, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#A3B18A', borderRadius: 20 },
  servicesList: {
    maxHeight: 200,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#AEBBB0',
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  serviceIconContainer: {
    marginRight: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: isSmallScreen ? 8 : 12,
    marginTop: isSmallScreen ? 24 : 32,
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  baseButton: {
    width: isSmallScreen ? '48%' : '45%',
    height: 40,
    paddingVertical: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    width: '100%',
    height: 40,
    paddingVertical: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#3A593F',
  },
  baseButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#000000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  businessHoursContainer: {
    width: '100%',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    flex: 1,
    maxHeight: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'left',
    color: '#000000',
  },
  timezoneContainer: {
    marginBottom: isSmallScreen ? 16 : 24,
    width: '100%',
  },
  timezoneLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: isSmallScreen ? 2 : 4,
  },
  timezoneSubtext: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666666',
    marginBottom: isSmallScreen ? 8 : 12,
  },
  timezoneSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 8 : 12,
    width: '100%',
  },
  timezoneText: {
    fontSize: 14,
    color: '#000000',
  },
  hoursList: {
    maxHeight: isSmallScreen ? 320 : 400,
    marginBottom: isSmallScreen ? 16 : 24,
  },
  hoursScrollContent: {
    paddingVertical: isSmallScreen ? 4 : 8,
  },
  dayRow: {
    marginBottom: isSmallScreen ? 16 : 24,
  },
  dayToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
    marginBottom: isSmallScreen ? 8 : 12,
  },
  dayText: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '500',
    color: '#000000',
  },
  timeInputContainer: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 12,
    paddingLeft: isSmallScreen ? 44 : 56,
  },
  timeInput: {
    flex: 1,
    maxWidth: 150,
    height: isSmallScreen ? 36 : 40,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: isSmallScreen ? 8 : 12,
    backgroundColor: '#FFFFFF',
  },
  timeInputLabel: {
    position: 'absolute',
    top: isSmallScreen ? 2 : 4,
    left: isSmallScreen ? 8 : 12,
    fontSize: isSmallScreen ? 10 : 12,
    color: '#666666',
  },
  timeInputText: {
    marginTop: isSmallScreen ? 14 : 16,
    fontSize: isSmallScreen ? 12 : 14,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  timeOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  servicesDropdown: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#3A5A40',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedServiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#AEBBB0',
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
});

function NewDetails() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [timeZone, setTimeZone] = useState('UTC-09:00');
  const [serviceInput, setServiceInput] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [businessData, setBusinessData] = useState({
    shopName: '',
    shopAddress: '',
    services: [] as string[],
    businessHours: {} as BusinessHours,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeField, setSelectedTimeField] = useState<{day: string, field: 'from' | 'to'} | null>(null);
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);
  const [showServicesPicker, setShowServicesPicker] = useState(false);
  const styles = getStyles(step);

  useEffect(() => {
    const initialHours: BusinessHours = {};
    DAYS.forEach(day => {
      initialHours[day] = { isOpen: true, from: '09:00AM', to: '09:00AM' };
    });
    setBusinessData(prev => ({ ...prev, businessHours: initialHours }));
  }, []);

  const handleAddService = () => {
    if (serviceInput.trim()) {
      setBusinessData(prev => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const handleServiceSelect = (service: string) => {
    setBusinessData(prev => {
      if (prev.services.includes(service)) {
        return {
          ...prev,
          services: prev.services.filter(s => s !== service)
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, service]
        };
      }
    });
  };

  const handleRemoveService = (service: string) => {
    setBusinessData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Starting save process...');
      
      // Validate required fields
      if (!businessData.shopName.trim() || !businessData.shopAddress.trim()) {
        Alert.alert('Error', 'Shop name and address are required');
        return;
      }

      if (businessData.services.length === 0) {
        Alert.alert('Error', 'Please add at least one service');
        return;
      }

      // Get the access token directly from AsyncStorage
      console.log('Fetching access token...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('Access token:', accessToken ? 'exists' : 'missing');

      if (!accessToken) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      // Get stored user data for other information
      const storedUserData = await AsyncStorage.getItem('userData');
      if (!storedUserData) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const userData = JSON.parse(storedUserData);

      // Prepare the data for the backend
      const businessProfileData = {
        shop_name: businessData.shopName,
        address: businessData.shopAddress,
        business_hours: businessData.businessHours,
        services: businessData.services,
        timezone: timeZone,
      };

      console.log('Sending data to backend:', businessProfileData);

      // Update the backend using the access token
      const response = await updateBusinessProfile(accessToken, businessProfileData);
      console.log('Backend response:', response);

      // Update local storage
      const updatedUserData = {
        ...userData,
        accountType: 'business',
        shopName: businessData.shopName,
        shopAddress: businessData.shopAddress,
        services: businessData.services,
        businessHours: businessData.businessHours,
        timeZone: timeZone,
      };
      
      console.log('Updating local storage with:', updatedUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

      // Show success popup
      setShowSuccessPopup(true);

      // Navigate to home page after delay
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.replace("/home");
      }, 2000);

    } catch (error) {
      console.error('Error saving business data:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update business profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Grid at the Top-Right */}
      <GridComponent />

      <View style={styles.formContainer}>
        <View style={styles.formBox}>
          <View style={styles.stepsIndicator}>
            {[1, 2, 3].map((stepNumber) => (
              <TouchableOpacity
                key={stepNumber}
                onPress={() => setStep(stepNumber)}
                style={[
                  styles.stepIndicator,
                  { backgroundColor: stepNumber === step ? '#3A593F' : '#AEBBB0' }
                ]}
              >
                <Text style={styles.stepText}>Step {stepNumber}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.stepTitle}>
            {step === 1 ? 'Business Details' : step === 2 ? 'Services' : 'Business Hours'}
          </Text>

          {step === 1 && (
            <>
              <TextInput
                style={styles.input}
                value={businessData.shopName}
                onChangeText={(text) => setBusinessData(prev => ({ ...prev, shopName: text }))}
                placeholder="Shop name"
                placeholderTextColor="#A3B18A"
              />

              <TextInput
                style={styles.input}
                value={businessData.shopAddress}
                onChangeText={(text) => setBusinessData(prev => ({ ...prev, shopAddress: text }))}
                placeholder="Address"
                placeholderTextColor="#A3B18A"
              />

              <TouchableOpacity
                style={[styles.fullWidthButton, styles.saveButton]}
                onPress={() => setStep(2)}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.servicesDropdown}>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowServicesPicker(true)}
                >
                  <Text style={styles.dropdownText}>
                    {businessData.services.length > 0 
                      ? `${businessData.services.length} services selected` 
                      : 'Select Services'}
                  </Text>
                  <ChevronDown size={20} color="#3A5A40" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.servicesList}>
                {businessData.services.map((service, index) => (
                  <View key={index} style={styles.selectedServiceItem}>
                    <Text style={styles.serviceText}>{service}</Text>
                    <TouchableOpacity onPress={() => handleRemoveService(service)}>
                      <Text style={{ color: '#FFFFFF', marginLeft: 8 }}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.fullWidthButton, styles.saveButton]}
                onPress={() => setStep(3)}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <View style={styles.businessHoursContainer}>
              <View style={styles.timezoneContainer}>
                <Text style={styles.timezoneLabel}>Timezone</Text>
                <Text style={styles.timezoneSubtext}>Set your timezone</Text>
                <TouchableOpacity 
                  style={styles.timezoneSelector}
                  onPress={() => setShowTimezonePicker(true)}
                >
                  <Text style={styles.timezoneText}>{timeZone}</Text>
                  <ChevronDown size={16} color="#666666" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.hoursList}
                contentContainerStyle={styles.hoursScrollContent}
                showsVerticalScrollIndicator={true}
              >
                {Object.entries(businessData.businessHours).map(([day, hours]) => (
                  <View key={day} style={styles.dayRow}>
                    <View style={styles.dayToggleContainer}>
                      <Switch
                        value={hours.isOpen}
                        onValueChange={(value) =>
                          setBusinessData(prev => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: { ...hours, isOpen: value }
                            }
                          }))
                        }
                        trackColor={{ false: '#E5E5E5', true: '#3A593F' }}
                        thumbColor="#FFFFFF"
                      />
                      <Text style={styles.dayText}>{day}</Text>
                    </View>

                    <View style={styles.timeInputContainer}>
                      <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => {
                          setSelectedTimeField({day, field: 'from'});
                          setShowTimePicker(true);
                        }}
                      >
                        <Text style={styles.timeInputLabel}>From</Text>
                        <Text style={styles.timeInputText}>{hours.from}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => {
                          setSelectedTimeField({day, field: 'to'});
                          setShowTimePicker(true);
                        }}
                      >
                        <Text style={styles.timeInputLabel}>To</Text>
                        <Text style={styles.timeInputText}>{hours.to}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.baseButton, styles.cancelButton]}
                  onPress={() => router.back()}
                >
                  <Text style={[styles.baseButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.baseButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={[styles.baseButtonText, styles.buttonText]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          >
            <View style={styles.timePickerContainer}>
              <ScrollView>
                {TIME_OPTIONS.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.timeOption}
                    onPress={() => {
                      if (selectedTimeField) {
                        setBusinessData(prev => ({
                          ...prev,
                          businessHours: {
                            ...prev.businessHours,
                            [selectedTimeField.day]: {
                              ...prev.businessHours[selectedTimeField.day],
                              [selectedTimeField.field]: time
                            }
                          }
                        }));
                      }
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={styles.timeOptionText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showTimezonePicker && (
        <Modal
          visible={showTimezonePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimezonePicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTimezonePicker(false)}
          >
            <View style={styles.timePickerContainer}>
              <ScrollView>
                {TIME_ZONES.map((tz) => (
                  <TouchableOpacity
                    key={tz.value}
                    style={styles.timeOption}
                    onPress={() => {
                      setTimeZone(tz.value);
                      setShowTimezonePicker(false);
                    }}
                  >
                    <Text style={styles.timeOptionText}>{tz.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showServicesPicker && (
        <Modal
          visible={showServicesPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowServicesPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowServicesPicker(false)}
          >
            <View style={styles.timePickerContainer}>
              <ScrollView>
                {PREDEFINED_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={styles.timeOption}
                    onPress={() => handleServiceSelect(service)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {businessData.services.includes(service) && (
                        <Check size={16} color="#3A5A40" style={{ marginRight: 8 }} />
                      )}
                      <Text style={styles.timeOptionText}>{service}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Success Popup */}
      <SuccessPopup visible={showSuccessPopup} message="Upgrade account successful" />
    </SafeAreaView>
  );
}

export default NewDetails;