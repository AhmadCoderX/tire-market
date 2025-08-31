import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';

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

const Chat = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<APIMessage[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // TODO: Fetch recipient details and set selectedRecipient
  };

  const handleSendMessage = (message: string) => {
    // TODO: Implement send message logic
  };

  const handleSendImage = (imageUri: string) => {
    // TODO: Implement send image logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[
          styles.chatSidebar,
          isMobile && styles.fullWidth,
          !isMobile && styles.desktopSidebar
        ]}>
          <ChatSidebar
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </View>
        {(!isMobile || activeConversationId) && (
          <View style={[
            styles.chatMain,
            isMobile && styles.fullWidth,
            !isMobile && styles.desktopMain
          ]}>
            <ChatMain
              recipient={selectedRecipient}
              onSendMessage={handleSendMessage}
              onSendImage={handleSendImage}
              messages={messages}
              setMessages={setMessages}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 32,
    maxWidth: 900,
    marginHorizontal: 'auto',
  },
  chatSidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  chatMain: {
    width: 500,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  desktopSidebar: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMain: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Chat;