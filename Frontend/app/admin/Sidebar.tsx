import type React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"

interface SidebarProps {
  activeItem: string
  onItemSelect: (item: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={[styles.menuItem, activeItem === "dashboard" && styles.activeMenuItem]}
              onPress={() => onItemSelect("dashboard")}
            >
              <View style={styles.menuItemContent}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/6ebf35c10e12ad8e336e0b71f260e9dfe15c230d4462b1daee0b03de8eff982b?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.menuIcon}
                />
                <View style={styles.menuTextContainer}>
                  <View style={styles.menuTextWrapper}>
                    <Text style={[styles.menuText, activeItem === "dashboard" && styles.activeMenuText]}>
                      Dashboard
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, activeItem === "listing" && styles.activeMenuItem]}
              onPress={() => onItemSelect("listing")}
            >
              <View style={styles.menuItemContent}>
                <Image
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7f1eb8e5dd741df90159102fc53132206ad2f9129a8183f5a75331ed223fa2ce?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
                  }}
                  style={styles.menuIcon}
                />
                <View style={styles.menuTextContainer}>
                  <View style={styles.menuTextWrapper}>
                    <Text style={[styles.menuText, activeItem === "listing" && styles.activeMenuText]}>
                      Listing Management
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "stretch",
    width: "20%", // Further reduced from 15% to 14%
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    marginRight: 0,
    marginLeft: -40, // Increased negative margin from -25 to -35
    paddingLeft: 0,
    marginTop: 10,
    height: 600,
  },
  content: {
    display: "flex",
    paddingLeft:30, // Set to exactly 2px as requested
    paddingRight: 10, // Set to exactly 2px as requested
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    justifyContent: "space-between",
    width: "90%",
    flex: 1,
  },
  menuContainer: {
    width: "100%",
  },
  menuContent: {
    width: "100%",
  },
  menuItem: {
    borderRadius: 4,
    display: "flex",
    marginTop: 4,
    width: "100%",
    paddingLeft: 3, // Reduced from 5 to 3 to fit in narrower space
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "column",
    alignItems: "stretch",
    color: "#969696",
    justifyContent: "center",
  },
  activeMenuItem: {
    borderLeftWidth: 2,
    borderColor: "#576C61",
    backgroundColor: "#EBEDEC",
  },
  menuItemContent: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 2,
    flexDirection: "row",
  },
  menuIcon: {
    aspectRatio: 1,
    width: 24,
    height: 24,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flexShrink: 0,
  },
  menuTextContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
  },
  menuTextWrapper: {
    alignSelf: "stretch",
  },
  menuText: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    color: "#969696",
  },
  activeMenuText: {
    color: "#354E41",
  },
})

export default Sidebar

