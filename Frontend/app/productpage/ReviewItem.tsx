import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import StarRating from "./StarRating";


interface ReviewItemProps {
  userName: string;
  rating: number;
  date: string;
  comment: string;
  profileImage: string | null | undefined;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  userName,
  rating,
  date,
  comment,
  profileImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/images/profile-placeholder.png')}
            style={styles.profileImage}
            defaultSource={require('../../assets/images/profile-placeholder.png')}
          />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <StarRating rating={rating} size={14} />
      </View>
      <Text style={styles.comment}>{comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5E5',
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: '#333333',
  },
  date: {
    fontSize: 11,
    fontFamily: 'Arial',
    color: '#666666',
  },
  comment: {
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#333333',
    lineHeight: 18,
  },
});

export default ReviewItem;
