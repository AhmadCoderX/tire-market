import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";

interface ContactDetailsProps {
  style?: object;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ style }) => {
  const { isSmallScreen } = useResponsiveLayout();

  const handlePhonePress = () => {
    Linking.openURL("tel:5551234567");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:contact@tiremaxpro.com");
  };

  const handleAddressPress = () => {
    Linking.openURL("https://maps.google.com/?q=123 Wheel Street");
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="none"
      accessibilityLabel="Contact Details"
    >
      <View style={styles.innerContainer}>
        <Text
          style={[styles.heading, isSmallScreen && styles.headingSmall]}
          accessibilityRole="header"
        >
          Contact Details
        </Text>
        <View style={styles.contactList}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={handlePhonePress}
            accessibilityRole="button"
            accessibilityLabel="Call (555) 123-4567"
          >
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/00604c05ac7e5b305edf924be168d39b9444c6707e25c447c247cc62e71b5515?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.contactIcon}
              accessibilityLabel="Phone icon"
            />
            <Text style={styles.contactText}>(555) 123-4567</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleEmailPress}
            accessibilityRole="button"
            accessibilityLabel="Email contact@tiremaxpro.com"
          >
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/09af9a3a6ca6d6235a728b44a39b6bd55112414be3924bcde675e0f7c59b2eaf?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.contactIcon}
              accessibilityLabel="Email icon"
            />
            <Text style={styles.contactText}>contact@tiremaxpro.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handleAddressPress}
            accessibilityRole="button"
            accessibilityLabel="View address on map: 123 Wheel Street"
          >
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d36d484cdce91c9fa2d8828a6163e0131c6aa9c52c7fee30ceb4ef5cebfb7f2b?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={styles.contactIcon}
              accessibilityLabel="Location icon"
            />
            <Text style={styles.contactText}>
              123 Wheel Street 123 Wheel Street
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#F5F5F5",
    alignSelf: "stretch",
    minWidth: 240,
    padding: 24,
  },
  innerContainer: {
    maxWidth: "100%",
    width: "100%",
  },
  heading: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: "500",
    color: "#2B2B2B",
    lineHeight: 24,
  },
  headingSmall: {
    fontSize: 18,
  },
  contactList: {
    marginTop: 16,
    width: "100%",
    flexDirection: "column",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  contactIcon: {
    width: 16,
    height: 16,
    aspectRatio: 1,
  },
  contactText: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 16,
    fontWeight: "400",
    color: "#2B2B2B",
    lineHeight: 24,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});

export default ContactDetails;
