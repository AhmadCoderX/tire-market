import * as React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Header from "./header/Header";
import SellerProfile from "./listing/SellerProfile";
import ContactDetails from "./listing/ContactDetails";
import PublishedAds from "./listing/PublishedAds";
import { useResponsiveLayout } from "./listing/useResponsiveLayout";

const Buyer: React.FC = () => {
  const { isSmallScreen, isMediumScreen } = useResponsiveLayout();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View
            style={[
              styles.topRow,
              isSmallScreen && styles.topRowSmall,
              isMediumScreen && styles.topRowMedium,
            ]}
          >
            <SellerProfile
              style={[
                styles.sellerProfile,
                isSmallScreen && styles.sellerProfileSmall,
                isMediumScreen && styles.sellerProfileMedium,
              ]}
            />
            <ContactDetails
              style={[
                styles.contactDetails,
                isSmallScreen && styles.contactDetailsSmall,
                isMediumScreen && styles.contactDetailsMedium,
              ]}
            />
          </View>
          <View style={styles.bottomRow}>
            <PublishedAds />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 81,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1188,
    marginTop: 54,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 30,
    flexWrap: "wrap",
  },
  topRowSmall: {
    flexDirection: "column",
    gap: 16,
  },
  topRowMedium: {
    gap: 20,
  },
  sellerProfile: {
    width: "69%",
  },
  sellerProfileSmall: {
    width: "100%",
  },
  sellerProfileMedium: {
    width: "60%",
  },
  contactDetails: {
    width: "28%",
  },
  contactDetailsSmall: {
    width: "100%",
  },
  contactDetailsMedium: {
    width: "35%",
  },
  bottomRow: {
    marginTop: 32,
    width: "100%",
  },
});

export default Buyer;
