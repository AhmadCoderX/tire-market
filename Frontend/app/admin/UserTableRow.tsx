import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ActivityIndicator
} from "react-native";
import StatusBadge from "./StatusBadge";
import ActionsMenu from "./ActionsMenu";

type StatusType = "Approved" | "Suspended" | "Banned";

interface UserTableRowProps {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  email: string;
  registeredDate: string;
  lastActive: string;
  status: StatusType;
  onAction: (action: string, userId: string) => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  id,
  avatar,
  name,
  email,
  registeredDate,
  lastActive,
  status,
  onAction,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Fallback profile image
  const fallbackImage = require('../../assets/images/profile-placeholder.png');
  
  return (
    <View style={styles.container}>
      <View style={styles.nameCell}>
        <View style={styles.profileImageContainer}>
          {imageLoading && <ActivityIndicator size="small" color="#344E41" style={styles.loader} />}
          <Image 
            source={imageError ? fallbackImage : avatar} 
            style={styles.profileImage} 
            onError={() => {
              console.log('Image error occurred for:', name);
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.emailCell}>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.dateCell}>
        <Text style={styles.dateText}>{registeredDate}</Text>
      </View>

      <View style={styles.dateCell}>
        <Text style={styles.dateText}>{lastActive}</Text>
      </View>

      <View style={styles.statusCell}>
        <Text style={[styles.statusText, getStatusStyle(status)]}>
          {status}
        </Text>
      </View>

      <View style={styles.actionCell}>
        <ActionsMenu 
          userId={id}
          currentStatus={status}
          onAction={onAction}
        />
      </View>
    </View>
  );
};

// Helper function to get status style
const getStatusStyle = (status: StatusType) => {
  switch(status) {
    case 'Approved':
      return styles.approvedStatus;
    case 'Suspended':
      return styles.suspendedStatus;
    case 'Banned':
      return styles.bannedStatus;
    default:
      return styles.approvedStatus;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  nameCell: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontWeight: '500',
    color: '#1E293B',
    fontSize: 14,
  },
  emailCell: {
    flex: 2.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  emailText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '400',
  },
  dateCell: {
    flex: 2,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dateText: {
    color: '#353535',
    fontSize: 14,
    fontWeight: '400',
  },
  statusCell: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  approvedStatus: {
    color: '#10B981',
  },
  suspendedStatus: {
    color: '#FFCC00',
  },
  bannedStatus: {
    color: '#EF4444',
  },
  actionCell: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default UserTableRow;
