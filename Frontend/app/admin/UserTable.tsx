import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import UserTableRow from "./UserTableRow";

interface UserData {
  id: string;
  avatar: any;
  name: string;
  email: string;
  registeredDate: string;
  lastActive: string;
  status: "Approved" | "Suspended" | "Banned";
}

interface UserTableProps {
  users: UserData[];
  onUserUpdate: (userId: string, newStatus: string) => Promise<void>;
  onViewListings: (userId: string) => void;
  onViewReviews: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onUserUpdate,
  onViewListings,
  onViewReviews
}) => {
  const handleAction = async (action: string, userId: string) => {
    try {
      console.log('UserTable handleAction called:', action, userId);
      switch (action) {
        case 'approve':
        case 'suspend':
        case 'ban':
          console.log('Attempting to update user status:', action);
          await onUserUpdate(userId, action);
          console.log('User status updated successfully');
          break;
        
        case 'viewListings':
          onViewListings(userId);
          break;
        
        case 'viewReviews':
          onViewReviews(userId);
          break;
        
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error handling action:', error);
      Alert.alert('Error', 'Failed to perform action. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <View style={styles.headerName}>
          <Text style={styles.columnHeader}>Name</Text>
        </View>
        <View style={styles.headerEmail}>
          <Text style={styles.columnHeader}>Email</Text>
        </View>
        <View style={styles.headerDate}>
          <Text style={styles.columnHeader}>Registered Date</Text>
        </View>
        <View style={styles.headerDate}>
          <Text style={styles.columnHeader}>Last Active</Text>
        </View>
        <View style={styles.headerStatus}>
          <Text style={styles.columnHeader}>Status</Text>
        </View>
        <View style={styles.headerActions}>
          <Text style={styles.columnHeader}>Actions</Text>
        </View>
      </View>

      <ScrollView
        style={styles.listingsContainer}
        showsVerticalScrollIndicator={false}
      >
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            id={user.id}
            avatar={user.avatar}
            name={user.name}
            email={user.email}
            registeredDate={user.registeredDate}
            lastActive={user.lastActive}
            status={user.status}
            onAction={handleAction}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 16,
    padding: 0,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  columnHeader: {
    fontWeight: '600',
    color: '#64748B',
    fontSize: 16,
  },
  listingsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    maxHeight: 470,
  },
  headerName: {
    flex: 2.5,
    paddingHorizontal: 16,
  },
  headerEmail: {
    flex: 2.5,
    paddingHorizontal: 16,
  },
  headerDate: {
    flex: 2,
    paddingHorizontal: 16,
  },
  headerStatus: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerActions: {
    flex: 0.7,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
});

export default UserTable;
