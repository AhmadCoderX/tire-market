"use client"

import type * as React from "react"
import { View, StyleSheet, ScrollView, Text } from "react-native"
import { useEffect, useState } from "react"
import ConversationItem from "./ConversationItem"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ensureAbsoluteUrl } from "../services/api"

interface APIConversation {
  user: {
    id: string;
    username: string;
    profile_image_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
}

interface ChatSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  initialSellerId?: string;
  initialSellerName?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeConversationId,
  onSelectConversation,
  initialSellerId,
  initialSellerName,
}) => {
  const [conversations, setConversations] = useState<APIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

              const response = await fetch('http://127.0.0.1:8000/api/messages/conversations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      console.log('Fetched conversations:', data);
      
      // Process the profile images to ensure absolute URLs
      const processedData = data.map((conversation: APIConversation) => {
        if (conversation.user && conversation.user.profile_image_url) {
          conversation.user.profile_image_url = ensureAbsoluteUrl(conversation.user.profile_image_url);
        }
        return conversation;
      });
      
      setConversations(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centerContent}>
          <Text>Loading conversations...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  const validConversations = conversations.filter(
    conversation => conversation && conversation.user && conversation.last_message
  );

  const initialSellerExists = initialSellerId && validConversations.some(
    conv => conv.user.id === initialSellerId
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {validConversations.length > 0 || (initialSellerId && initialSellerName) ? (
          <>
            {/* Add temporary entry for new conversation if it came via URL params */}
            {initialSellerId && initialSellerName && !initialSellerExists && (
              <ConversationItem
                key={`temp-${initialSellerId}`}
                id={initialSellerId}
                name={initialSellerName}
                lastMessage="New conversation"
                time="Now"
                isActive={initialSellerId === activeConversationId}
                onSelect={onSelectConversation}
                unreadCount={0}
              />
            )}
            
            {/* Render existing conversations */}
            {validConversations.map((conversation) => {
              // If the last message is an image, show 'image' instead of the URL
              let lastMessageContent = conversation.last_message.content;
              if (typeof lastMessageContent === 'string' && lastMessageContent.startsWith('data:image/')) {
                lastMessageContent = 'image';
              }
              return (
                <ConversationItem
                  key={conversation.user.id}
                  id={conversation.user.id}
                  name={conversation.user.username}
                  lastMessage={lastMessageContent}
                  time={formatRelativeTime(new Date(conversation.last_message.created_at))}
                  avatar={conversation.user.profile_image_url || undefined}
                  isActive={conversation.user.id === activeConversationId}
                  onSelect={onSelectConversation}
                  unreadCount={conversation.unread_count}
                />
              );
            })}
          </>
      ) : (
          <View style={styles.centerContent}>
            <Text>No conversations yet</Text>
        </View>
      )}
      </ScrollView>
    </View>
  );
};

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#050505",
    padding: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
  },
});

export default ChatSidebar;