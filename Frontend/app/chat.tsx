"use client"

import * as React from "react"
import { View, StyleSheet, SafeAreaView, Dimensions, useWindowDimensions, Text, Alert } from "react-native"
import ChatHeader from "./header/Header"
import ChatSidebar from "./chat/ChatSidebar"
import ChatMain from "./chat/ChatMain"
import ChatAdBanner from "./chat/ChatAdBanner"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLocalSearchParams, useRouter } from "expo-router"
import { createConversation, ensureAbsoluteUrl } from "./services/api"

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

const Chat: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null)
    const [selectedRecipient, setSelectedRecipient] = React.useState<{
        id: string;
        name: string;
        lastActive: string | null | undefined;
        avatar: string;
    } | null>(null)
    const [messages, setMessages] = React.useState<APIMessage[]>([])
    const { width } = useWindowDimensions()
    const isMobile = width < 768
    const params = useLocalSearchParams();
    const incomingSellerId = params.sellerId as string | undefined;
    const incomingSellerName = params.sellerName as string | undefined;
    const listingId = params.listingId as string | undefined;
    const listingTitle = params.listingTitle as string | undefined;
    const listingPrice = params.listingPrice as string | undefined;
    const listingImage = params.listingImage as string | undefined;
    const [initializingConversation, setInitializingConversation] = React.useState(false);
    const initializationAttempted = React.useRef(false);
    const listingMessageSent = React.useRef(false);

    React.useEffect(() => {
        console.log("URL Parameters:", incomingSellerId, incomingSellerName);
        
        // Initialize a new conversation if sellerId is provided in URL params
        // But only do this once to avoid multiple initializations
        if (incomingSellerId && !selectedConversationId && !initializationAttempted.current) {
            initializationAttempted.current = true;
            console.log("Initializing conversation with seller:", incomingSellerId, incomingSellerName);
            setInitializingConversation(true);
            handleSelectConversation(incomingSellerId);
        }
    }, [incomingSellerId, selectedConversationId]);

    // Send listing message when conversation is initialized and we have listing info
    React.useEffect(() => {
        if (selectedConversationId && selectedRecipient && !initializingConversation && listingId && !listingMessageSent.current) {
            // Add a small delay to ensure the conversation UI is ready
            const timer = setTimeout(() => {
                sendListingMessage();
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [selectedConversationId, selectedRecipient, initializingConversation, listingId]);

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    const handleSelectConversation = async (id: string) => {
        if (id === selectedConversationId && !initializingConversation) return; // Already selected
        
        console.log("Selecting conversation with ID:", id);
        setSelectedConversationId(id);
        
        try {
            const token = await AsyncStorage.getItem('accessToken')
            if (!token) {
                console.error('No access token found')
                Alert.alert("Error", "You need to be logged in to chat with sellers");
                router.push("/login");
                return
            }

            // First try to create a new message to initialize the conversation if it doesn't exist
            // This is important for new conversations where no messages have been exchanged yet
            if (initializingConversation || incomingSellerId === id) {
                try {
                    console.log("Attempting to initialize conversation by sending an empty message");
                    // We don't actually send a message, but we check if the API endpoint works
                    // This will create the conversation in the backend if it doesn't exist
                    await fetch(`http://127.0.0.1:8000/api/messages/history/${id}/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    console.log("New conversation creation check:", error);
                    // It's okay if this fails, we'll try to fetch user details next
                }
            }

            // Attempt to fetch user details
            console.log("Fetching user details for ID:", id);
            const userResponse = await fetch(`http://127.0.0.1:6000/api/users/${id}/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Check if the userResponse is not found, but we have incomingSellerName
            // This will happen for new conversations where we haven't fetched user details yet
            let userData = { 
                last_login: null,
                username: incomingSellerName || "User",
                profile_image_url: null 
            };

            if (!userResponse.ok) {
                console.log("User details not found, using incoming seller name");
                if (!incomingSellerName && id !== incomingSellerId) {
                throw new Error('Failed to fetch user details');
            }
            } else {
                userData = await userResponse.json();
            console.log('User data received:', userData);

                // Ensure profile image URL is absolute
                if (userData.profile_image_url) {
                    userData.profile_image_url = ensureAbsoluteUrl(userData.profile_image_url);
                }
            }

            // Try to fetch messages, but for a new conversation, there won't be any
            let recipientData = {
                id: id,
                name: userData.username || incomingSellerName || "User",
                lastActive: userData.last_login,
                avatar: userData.profile_image_url || ""
            };

            try {
            // Then fetch messages
            const messagesResponse = await fetch(`http://127.0.0.1:6000/api/messages/history/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

                // If messages exist, set them and use the first message to get recipient details
                if (messagesResponse.ok) {
            const messages = await messagesResponse.json();
            console.log('Messages received:', messages);

                    // Process message images to ensure absolute URLs
                    const processedMessages = messages.map((msg: APIMessage) => {
                        if (msg.sender_image) {
                            msg.sender_image = ensureAbsoluteUrl(msg.sender_image);
                        }
                        if (msg.receiver_image) {
                            msg.receiver_image = ensureAbsoluteUrl(msg.receiver_image);
                        }
                        return msg;
                    });
                    
                    setMessages(processedMessages || []);

                    if (processedMessages && processedMessages.length > 0) {
                        const firstMessage = processedMessages[0];
                        const senderImg = ensureAbsoluteUrl(firstMessage.sender_image);
                        const receiverImg = ensureAbsoluteUrl(firstMessage.receiver_image);
                        
                        recipientData = {
                    id: id,
                    name: firstMessage.sender === id ? firstMessage.sender_name : firstMessage.receiver_name,
                    lastActive: userData.last_login,
                            avatar: firstMessage.sender === id ? senderImg : receiverImg
                        };
                    }
                } else {
                    // No messages yet, set empty array
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }

                console.log('Setting recipient data:', recipientData);
                setSelectedRecipient(recipientData);
            setInitializingConversation(false);
        } catch (error) {
            console.error('Error handling conversation selection:', error);
            setInitializingConversation(false);
            Alert.alert("Error", "Failed to start conversation. Please try again.");
        }
    }

    const handleSendMessage = async (message: string) => {
        if (!selectedConversationId) return

        try {
            const token = await AsyncStorage.getItem('accessToken')
            if (!token) {
                console.error('No access token found')
                return
            }

            console.log("Sending message to:", selectedConversationId, message);
            const response = await fetch('http://127.0.0.1:6000/api/messages/send/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver: selectedConversationId,
                    content: message
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            const newMessage = await response.json()
            console.log('New message sent:', newMessage)

            if (selectedRecipient) {
                const messagesResponse = await fetch(`http://127.0.0.1:6000/api/messages/history/${selectedConversationId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (messagesResponse.ok) {
                    const messages = await messagesResponse.json()
                    setMessages(messages)
                }
            }
        } catch (err) {
            console.error('Error sending message:', err)
        }
    }

    const handleSendImage = async (imageUri: string) => {
        if (!selectedConversationId) return;

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                return;
            }

            console.log("Processing image for sending:", imageUri);
            
            // Step 1: Convert the image to base64
            // For React Native, we can use the fetch API to get the image as a blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
            
            // Convert blob to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64data = reader.result;
                    if (base64data) {
                        console.log("Image converted to base64, length:", base64data.toString().length);
                        
                        // Step 2: Send the base64 data as a message
                        sendBase64Image(base64data.toString(), selectedConversationId)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(new Error('Failed to convert image to base64'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.error('Error processing image:', err);
            Alert.alert("Error", "Failed to process image. Please try again.");
        }
    }
    
    // Helper function to send base64 image
    const sendBase64Image = async (base64data: string, receiverId: string) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                return;
            }
            
            // Send as a regular message but with base64 data
            // Format: "data:image/jpeg;base64,..."
            console.log("Sending base64 image to:", receiverId);
            
            // Prepare the message content with a special prefix so we can 
            // identify it as an image on the receiving end
            const imageMessage = base64data;
            
            const messageSendResponse = await fetch('http://127.0.0.1:6000/api/messages/send/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver: receiverId,
                    content: imageMessage
                })
            });

            if (!messageSendResponse.ok) {
                throw new Error('Failed to send image message');
            }

            const newMessage = await messageSendResponse.json();
            console.log('Image message sent:', newMessage);

            // Refresh the messages list
                            const messagesResponse = await fetch(`http://127.0.0.1:6000/api/messages/history/${receiverId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (messagesResponse.ok) {
                const messages = await messagesResponse.json();
                setMessages(messages);
            }
        } catch (err) {
            console.error('Error sending base64 image:', err);
            Alert.alert("Error", "Failed to send image. Please try again.");
        }
    }

    const handleBackToContacts = () => {
        setSelectedConversationId(null)
        setSelectedRecipient(null)
    }

    const sendListingMessage = async () => {
        if (!listingId || !listingTitle || !selectedConversationId || listingMessageSent.current) {
            return;
        }

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                console.error('No access token found');
                return;
            }

            // Create a structured product card message
            const productCardData = {
                type: 'product_card',
                listingId: listingId,
                title: listingTitle,
                price: listingPrice,
                image: listingImage,
                message: "Hi! I'm interested in this listing. Could you tell me more about it?"
            };

            // Send as JSON string with special prefix to identify as product card
            const listingMessage = `PRODUCT_CARD:${JSON.stringify(productCardData)}`;

            console.log("Sending automatic product card message:", listingMessage);
            
            const response = await fetch('http://127.0.0.1:6000/api/messages/send/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiver: selectedConversationId,
                    content: listingMessage
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send listing message');
            }

            listingMessageSent.current = true;
            console.log('Product card message sent successfully');

            // Refresh messages to show the new message
            if (selectedRecipient) {
                const messagesResponse = await fetch(`http://127.0.0.1:6000/api/messages/history/${selectedConversationId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (messagesResponse.ok) {
                    const messages = await messagesResponse.json();
                    // Process message images to ensure absolute URLs
                    const processedMessages = messages.map((msg: APIMessage) => {
                        if (msg.sender_image) {
                            msg.sender_image = ensureAbsoluteUrl(msg.sender_image);
                        }
                        if (msg.receiver_image) {
                            msg.receiver_image = ensureAbsoluteUrl(msg.receiver_image);
                        }
                        return msg;
                    });
                    setMessages(processedMessages);
                }
            }
        } catch (error) {
            console.error('Error sending listing message:', error);
        }
    };

    const handleLeftChatAdPress = () => {
        console.log("Left chat ad (Enhanced Messaging) pressed");
        // Navigate to chat upgrade/premium features page
    };

    const handleRightChatAdPress = () => {
        console.log("Right chat ad (Smart Notifications) pressed");
        // Navigate to notification settings/alert preferences page
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, { height: Dimensions.get("window").height }]}>
                <ChatHeader
                    onSearch={handleSearch}
                />
                
                {/* Advertisement Banners - Fixed Position */}
                <ChatAdBanner position="left" onPress={handleLeftChatAdPress} />
                <ChatAdBanner position="right" onPress={handleRightChatAdPress} />
                
                <View style={styles.content}>
                    {(!isMobile || (isMobile && !selectedConversationId)) && (
                        <View
                            style={[
                                styles.sidebarColumn,
                                isMobile && styles.fullWidth
                            ]}
                            accessibilityRole="none"
                            accessibilityLabel="Chat conversations"
                        >
                            <ChatSidebar
                                activeConversationId={selectedConversationId}
                                onSelectConversation={handleSelectConversation}
                                initialSellerId={incomingSellerId}
                                initialSellerName={incomingSellerName}
                            />
                        </View>
                    )}
                    {(!isMobile || (isMobile && selectedConversationId)) && (
                        <View style={[
                            styles.mainColumn,
                            isMobile && styles.fullWidth
                        ]}>
                            <ChatMain
                                recipient={selectedRecipient}
                                onSendMessage={handleSendMessage}
                                onSendImage={handleSendImage}
                                messages={messages}
                                setMessages={setMessages}
                                onBackToContacts={isMobile ? handleBackToContacts : undefined}
                                isInitializing={initializingConversation}
                            />
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
    },
    content: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
        gap: 20,
        padding: 20,
        maxWidth: 1200,
        alignSelf: "center",
        width: "100%",
    },
    sidebarColumn: {
        width: 280,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e6e6e6",
    },
    mainColumn: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e6e6e6",
        maxWidth: 850,
    },
    fullWidth: {
        width: "100%",
    }
})

export default Chat