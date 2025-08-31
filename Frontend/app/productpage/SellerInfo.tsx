import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

// Import the local placeholder image
const placeholderImage = require('../../assets/images/profile-placeholder.png');

interface SellerInfoProps {
  name: string;
  memberSince: string;
  type: string;
  profileImage?: string;
  onPress?: () => void;
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  name,
  memberSince,
  type,
  profileImage,
  onPress
}) => {
  return (
    <Pressable onPress={onPress}>
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.sellerDetails}>
          <View style={styles.profileSection}>
              {profileImage && profileImage !== "" ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  onError={() => console.log("Error loading profile image")}
                />
              ) : (
            <Image
                  source={placeholderImage}
              style={styles.profileImage}
            />
              )}
            <View style={styles.textContainer}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.memberSince}>Member since {memberSince}</Text>
              <Text style={styles.type}>{type} Seller</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'Arial',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerDetails: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Arial',
  },
  memberSince: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Arial',
  },
  type: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Arial',
    borderWidth: 1,
    borderColor: '#5B7560',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    backgroundColor: '#EAF2EB',
  },
});

export default SellerInfo;
