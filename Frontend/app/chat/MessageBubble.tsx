import React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import ProductCardMessage from "./ProductCardMessage"

interface MessageBubbleProps {
  message: string
  time: string
  isSender?: boolean
  isImage?: boolean
  isFirst?: boolean
  onImagePress?: (imageUri: string) => void
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  time,
  isSender = false,
  isImage = false,
  isFirst = false,
  onImagePress
}) => {
  const handleImagePress = () => {
    if (isImage && onImagePress) {
      onImagePress(message)
    }
  }

  // Check if this is a product card message
  const isProductCard = message.startsWith('PRODUCT_CARD:');
  
  if (isProductCard) {
    try {
      const productDataJson = message.replace('PRODUCT_CARD:', '');
      const productData = JSON.parse(productDataJson);
      
      return (
        <ProductCardMessage 
          productData={productData}
          time={time}
          isSender={isSender}
        />
      );
    } catch (error) {
      console.error('Error parsing product card data:', error);
      // Fall back to regular message if parsing fails
    }
  }

  return (
    <View style={[
      styles.container,
      isSender ? styles.senderContainer : styles.receiverContainer,
      isFirst && styles.firstMessage,
      isImage && styles.imageContainer
    ]}>
      <View style={styles.content}>
        {isImage ? (
          <TouchableOpacity onPress={handleImagePress} style={styles.imageWrapper}>
            <Image
              source={{ uri: message }}
              style={styles.imageMessage}
              resizeMode="cover"
              accessibilityLabel="Sent image"
            />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}>{message}</Text>
        )}
        <Text style={[styles.timeText, isSender ? styles.senderTimeText : styles.receiverTimeText]}>
          {time}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "65%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  imageContainer: {
    padding: 6,
  },
  firstMessage: {
    marginTop: 12,
  },
  senderContainer: {
    backgroundColor: "#ebedec",
    alignSelf: "flex-end",
    marginLeft: 50,
  },
  receiverContainer: {
    backgroundColor: "#ebedec",
    alignSelf: "flex-start",
    marginRight: 50,
    borderWidth: 1,
    borderColor: "#aeb6b1",
  },
  content: {
    flexDirection: "column",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    flexWrap: "wrap",
  },
  senderText: {
    color: "#050505",
  },
  receiverText: {
    color: "#050505",
  },
  imageWrapper: {
    borderRadius: 4,
    overflow: 'hidden',
    margin: 2,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 4,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  senderTimeText: {
    color: "#65676B",
  },
  receiverTimeText: {
    color: "#65676B",
  }
})

export default MessageBubble