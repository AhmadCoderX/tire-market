"use client"

import * as React from "react"
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity, Dimensions, useWindowDimensions } from "react-native"
import { useEffect, useState, useRef, useCallback } from "react"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ensureAbsoluteUrl } from "../services/api"

interface APIMessage {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: string;
  sender_name: string;
  sender_image: string;
  receiver: string;
  receiver_name: string;
  receiver_image: string;
}

interface Recipient {
  id: string;
  name: string;
  lastActive: string | null | undefined;
  avatar: string;
}

interface MessageGroup {
  date: string;
  messages: APIMessage[];
}

interface ChatMainProps {
  recipient: Recipient | null;
  onSendMessage: (message: string) => void;
  onSendImage: (imageUri: string) => void;
  messages: APIMessage[];
  setMessages: React.Dispatch<React.SetStateAction<APIMessage[]>>;
  onBackToContacts?: () => void;
  isInitializing?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const formatLastActive = (lastLogin: string | null | undefined) => {
  if (!lastLogin) return "Last seen a long time ago";
  
  try {
    // Parse the ISO timestamp correctly
    const lastActiveDate = new Date(lastLogin);
    
    // Check if the date is valid
    if (isNaN(lastActiveDate.getTime())) {
      console.error('Invalid date:', lastLogin);
      return "Last seen a long time ago";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastActiveDate.getTime()) / 1000);
    
    // For debugging
    console.log('Last active date:', lastActiveDate);
    console.log('Now:', now);
    console.log('Diff in seconds:', diffInSeconds);
    
    // If online in the last 2 minutes, show as online
    if (diffInSeconds < 120) {
      return "Online";
    }
    
    // If active today, show time
    if (diffInSeconds < 86400) {
      return `Last active today at ${lastActiveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If active yesterday
    if (diffInSeconds < 172800) {
      return `Last active yesterday at ${lastActiveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If active this week
    if (diffInSeconds < 604800) {
      return `Last active ${lastActiveDate.toLocaleDateString([], { weekday: 'long' })}`;
    }
    
    // Otherwise show date
    return `Last active on ${lastActiveDate.toLocaleDateString()}`;
  } catch (error) {
    console.error('Error formatting last active time:', error);
    return "Last seen a long time ago";
  }
};

const formatDateHeader = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const groupMessagesByDate = (messages: APIMessage[]): MessageGroup[] => {
  const groups: { [key: string]: APIMessage[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const ChatMain: React.FC<ChatMainProps> = ({ 
  recipient, 
  onSendMessage, 
  onSendImage,
  messages,
  setMessages,
  onBackToContacts,
  isInitializing
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null)
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollingInterval = useRef<NodeJS.Timeout>()
  const { width } = useWindowDimensions()
  const isMobile = width < 768

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: isMobile ? 12 : 16,
      borderBottomWidth: 1,
      borderBottomColor: "#e6e6e6",
      backgroundColor: "#ffffff",
      width: "100%",
    },
    headerContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: isMobile ? 2 : 4,
    },
    backButton: {
      marginRight: isMobile ? 8 : 16,
    },
    avatar: {
      width: isMobile ? 32 : 36,
      height: isMobile ? 32 : 36,
      borderRadius: isMobile ? 16 : 18,
      marginRight: isMobile ? 8 : 12,
      backgroundColor: "#e6e6e6",
    },
    headerInfo: {
      flex: 1,
    },
    recipientName: {
      fontSize: isMobile ? 14 : 16,
      fontWeight: "600",
      color: "#050505",
      marginBottom: 2,
    },
    lastActive: {
      fontSize: isMobile ? 11 : 13,
      color: "#65676B",
    },
    messagesContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingVertical: isMobile ? 12 : 20,
      width: "100%",
    },
    messagesList: {
      flex: 1,
      paddingHorizontal: isMobile ? 12 : 20,
      width: "100%",
    },
    messageRow: {
      flexDirection: "row",
      marginBottom: isMobile ? 8 : 12,
      width: "100%",
    },
    senderRow: {
      justifyContent: "flex-end",
    },
    receiverRow: {
      justifyContent: "flex-start",
    },
    noMessagesContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
      width: "100%",
    },
    noMessagesText: {
      fontSize: isMobile ? 14 : 16,
      color: "#65676B",
      textAlign: "center",
    },
    startChatText: {
      fontSize: isMobile ? 12 : 14,
      color: "#65676B",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      width: "100%",
    },
    startConversationContainer: {
      alignItems: "center",
      padding: isMobile ? 16 : 20,
    },
    startConversationText: {
      fontSize: isMobile ? 18 : 20,
      fontWeight: "600",
      color: "#333333",
      marginBottom: isMobile ? 6 : 8,
      fontFamily: "Arial",
    },
    startConversationSubtext: {
      fontSize: isMobile ? 12 : 14,
      color: "#6B6B6B",
      textAlign: "center",
      fontFamily: "Arial",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    loadingText: {
      fontSize: isMobile ? 14 : 16,
      color: "#65676b",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 16 : 20,
      width: "100%",
    },
    errorText: {
      fontSize: isMobile ? 14 : 16,
      color: "#dc3545",
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      width: "100%",
      height: "100%",
    },
    zoomedImageContainer: {
      width: "90%",
      height: "80%",
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    zoomedImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    closeButton: {
      position: "absolute",
      top: isMobile ? 20 : 40,
      right: isMobile ? 12 : 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 0,
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    closeButtonText: {
      color: "white",
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: 45,
      width: 50,
      height: 50,
      margin: 0,
      marginTop: -2,
    },
    dateHeader: {
      alignSelf: "center",
      backgroundColor: "#f0f2f5",
      paddingHorizontal: isMobile ? 8 : 12,
      paddingVertical: isMobile ? 4 : 6,
      borderRadius: 16,
      marginVertical: isMobile ? 8 : 16,
    },
    dateHeaderText: {
      fontSize: isMobile ? 10 : 12,
      color: "#65676B",
    },
    messageGroup: {
      marginBottom: isMobile ? 8 : 12,
      width: "100%",
    },
  });

  const fetchMessages = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')
      if (!token) {
        setError('No access token found')
        setLoading(false)
        return
      }

      if (!recipient?.id) {
        setError('No recipient selected')
        setLoading(false)
        return
      }

              const response = await fetch(`http://127.0.0.1:8000/api/messages/history/${recipient.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      
      // Process message sender/receiver images
      const processedData = data.map((message: APIMessage) => {
        if (message.sender_image) {
          message.sender_image = ensureAbsoluteUrl(message.sender_image);
        }
        if (message.receiver_image) {
          message.receiver_image = ensureAbsoluteUrl(message.receiver_image);
        }
        return message;
      });
      
      // Only update if there are new messages
      if (JSON.stringify(processedData) !== JSON.stringify(messages)) {
        console.log('New messages received:', processedData)
        setMessages(processedData)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      setLoading(false)
    }
  }, [recipient?.id, setMessages, messages])

  // Initial fetch when recipient changes
  useEffect(() => {
    if (recipient) {
      fetchMessages()
    }
  }, [recipient, fetchMessages])

  // Set up polling for new messages
  useEffect(() => {
    if (recipient) {
      // Clear any existing polling interval
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }

      // Start polling every 3 seconds
      pollingInterval.current = setInterval(() => {
        fetchMessages()
      }, 6000)

      // Cleanup function
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current)
        }
      }
    }
  }, [recipient, fetchMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleImagePress = (imageUri: string) => {
    setZoomedImage(imageUri)
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {isMobile && onBackToContacts && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackToContacts}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        {recipient?.avatar ? (
          <Image
            source={{ uri: ensureAbsoluteUrl(recipient.avatar) }}
            style={styles.avatar}
            accessibilityLabel={`${recipient.name}'s avatar`}
          />
        ) : (
          <View style={styles.avatar} />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.recipientName}>{recipient?.name || "Name to whom texting"}</Text>
          <Text style={styles.lastActive}>{formatLastActive(recipient?.lastActive)}</Text>
        </View>
      </View>
    </View>
  )

  if (!recipient) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.startConversationContainer}>
          <Text style={styles.startConversationText}>Start Conversation</Text>
          <Text style={styles.startConversationSubtext}>Select a conversation from the sidebar or start a new one</Text>
        </View>
      </View>
    )
  }

  if (isInitializing) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing conversation...</Text>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 1 }}
          indicatorStyle="black"
          nestedScrollEnabled={true}
          accessibilityLabel="Messages"
        >
          {messages.length > 0 ? (
            groupMessagesByDate(messages).map((group) => (
              <View key={group.date} style={styles.messageGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>
                    {formatDateHeader(new Date(group.date))}
                  </Text>
                </View>
                {group.messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageRow,
                      message.sender === recipient.id ? styles.receiverRow : styles.senderRow
                    ]}
                    accessibilityLabel={`${message.sender_name} said: ${message.content}. Sent at ${formatMessageTime(message.created_at)}`}
                  >
                    <MessageBubble
                      message={message.content}
                      time={formatMessageTime(message.created_at)}
                      isSender={message.sender !== recipient.id}
                      isImage={message.content.startsWith('http') || 
                              message.content.startsWith('file://') || 
                              message.content.startsWith('content://') ||
                              message.content.startsWith('data:image/')}
                      onImagePress={handleImagePress}
                    />
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.noMessagesContainer}>
              <Text style={styles.noMessagesText}>Write message</Text>
              <Text style={styles.startChatText}>Start your conversation with {recipient.name}</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <ChatInput onSendMessage={onSendMessage} onSendImage={onSendImage} />

      <Modal
        visible={!!zoomedImage}
        transparent={true}
        onRequestClose={() => setZoomedImage(null)}
        animationType="fade"
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1}
          onPress={() => setZoomedImage(null)}
        >
          <TouchableOpacity 
            style={styles.zoomedImageContainer} 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Image
              source={{ uri: zoomedImage || "" }}
              style={styles.zoomedImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setZoomedImage(null)}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default ChatMain

