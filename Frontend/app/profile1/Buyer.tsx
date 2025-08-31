import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  useWindowDimensions,
} from "react-native";
import Header from "./Header";
import SellerProfile from "./SellerProfile";
import ContactDetails from "./ContactDetails";
import ProductTabs from "./ProductTabs";
import CollapsibleSection from "./CollapsibleSection";

const services = [
  'Flat Tire Repair',
  'TPMS Service',
  'Wheel Alignment',
  'Tire Rotation',
];

const businessHours = [
  { day: 'Mon-Fri', hours: '8:00 AM - 6:00 PM' },
  { day: 'Sat', hours: '9:00 AM - 4:00 PM' },
  { day: 'Sun', hours: 'Closed' },
];

const Buyer: React.FC = () => {
  const userId = "default-user-id";
  const { width } = useWindowDimensions();
  const isTabletOrSmaller = width < 600;
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHoursOpen, setIsHoursOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Header />
          <View style={styles.mainContent}>
            <View style={[styles.profileContainer, isTabletOrSmaller && styles.profileContainerSmall]}>
              <View style={styles.profileSection}>
                <SellerProfile />
              </View>
              <View style={styles.contactSection}>
                <ContactDetails />
              </View>
            </View>
            <View style={styles.section}>
              <CollapsibleSection 
                title="Services" 
                isOpen={isServicesOpen}
                onToggle={() => setIsServicesOpen(!isServicesOpen)}
              >
                <View style={styles.servicesList}>
                  {services.map((service, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            </View>
            <View style={styles.section}>
              <CollapsibleSection 
                title="Business Hours" 
                isOpen={isHoursOpen}
                onToggle={() => setIsHoursOpen(!isHoursOpen)}
              >
                <View style={styles.hoursList}>
                  {businessHours.map((item, index) => (
                    <View key={index} style={styles.hourItem}>
                      <Text style={styles.dayText}>{item.day}</Text>
                      <Text style={styles.hoursText}>{item.hours}</Text>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            </View>
            <ProductTabs userId={userId} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 50,
  },
  mainContent: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1188,
    paddingHorizontal: 16,
    marginTop: 54,
    gap: 40,
  },
  profileContainer: {
    flexDirection: "row",
    gap: 32,
    width: "100%",
  },
  profileContainerSmall: {
    flexDirection: "column",
    gap: 24,
  },
  profileSection: {
    width: "100%",
  },
  contactSection: {
    width: "100%",
  },
  section: {
    width: "100%",
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  serviceItem: {
    backgroundColor: '#E9EDC9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A5A40',
  },
  serviceText: {
    color: '#3A5A40',
    fontSize: 14,
    flexWrap: 'wrap',
  },
  hoursList: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#333333',
  },
  hoursText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default Buyer;
