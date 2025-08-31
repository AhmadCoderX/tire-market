import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ensureAbsoluteUrl } from "../services/api";

interface ConversationItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  isActive?: boolean;
  onSelect: (id: string) => void;
  unreadCount: number;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  name,
  lastMessage,
  time,
  avatar,
  isActive = false,
  onSelect,
  unreadCount,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={() => onSelect(id)}
      accessibilityRole="button"
      accessibilityLabel={`Conversation with ${name}`}
      accessibilityHint="Double tap to view conversation"
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={avatar ? { uri: ensureAbsoluteUrl(avatar) } : require('../../assets/images/profile-placeholder.png')}
            style={styles.avatar}
            accessibilityLabel={`${name}'s profile picture`}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.nameText, unreadCount > 0 && styles.boldText]} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.rightSection}>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
              <Text style={styles.timeText} numberOfLines={1}>
                {time}
              </Text>
            </View>
          </View>
          <Text 
            style={[styles.messageText, unreadCount > 0 && styles.boldText]} 
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    width: "100%",
    backgroundColor: "#ffffff",
  },
  activeContainer: {
    backgroundColor: "#f0f2f5",
  },
  content: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#e6e6e6",
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  },
  timeText: {
    color: "#65676B",
    textAlign: "right",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 24,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  },
  messageText: {
    color: "#65676B",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 24,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#5B7560",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
  },
  boldText: {
    fontWeight: "600",
  },
});

export default ConversationItem;