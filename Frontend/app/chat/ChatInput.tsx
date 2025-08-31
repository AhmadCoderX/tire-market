import * as React from "react"
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Dimensions } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import { Alert } from "react-native"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onSendImage: (imageUri: string) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendImage }) => {
  const [message, setMessage] = React.useState("")
  const [files, setFiles] = React.useState<Array<{ uri: string; type: string; name: string }>>([])
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null)

  const handleSend = () => {
    if (files && files.length > 0) {
      // Send each file one by one
      files.forEach((file) => {
        console.log("Sending image with URI:", file.uri);
        onSendImage(file.uri);
      });
      setFiles([]);
    }

    if (message && message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleAttachPress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: true,
      })

      if (!result.canceled) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.name || "Image",
        }))

        setFiles((prevFiles) => [...prevFiles, ...newFiles])
      }
    } catch (error) {
      console.error("Error selecting image:", error)
      Alert.alert("Error", "Failed to select image. Please try again.")
    }
  }

  const isImageFile = (fileType: string) => {
    return fileType.startsWith("image/")
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return "https://cdn.builder.io/api/v1/image/assets/TEMP/pdf-icon.png?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f"
    } else if (fileType.includes("doc")) {
      return "https://cdn.builder.io/api/v1/image/assets/TEMP/doc-icon.png?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f"
    } else {
      return "https://cdn.builder.io/api/v1/image/assets/TEMP/file-icon.png?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f"
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
            <MaterialIcons name="attach-file" size={22} color="#5B7560" />
          </TouchableOpacity>

          <View style={[styles.inputWithPreviewContainer, files.length > 0 && styles.inputWithPreviewPadding]}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#A1A1A1"
                value={message}
                onChangeText={setMessage}
                multiline={true}
                maxLength={500}
                textAlignVertical="bottom"
                textAlign={message ? "left" : "center"}
              />
            </View>

            {files && files.length > 0 && (
              <View style={styles.filesPreviewContainer}>
                {files.map((file, index) => (
                  <View key={index} style={styles.filePreviewContainer}>
                    <TouchableOpacity
                      onPress={() => setZoomedImage(file.uri)}
                      style={styles.filePreview}
                    >
                      <Image
                        source={{ uri: file.uri }}
                        style={styles.filePreviewImage}
                        accessibilityLabel="Selected image"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeFileButton} onPress={() => handleRemoveFile(index)}>
                      <Text style={styles.removeFileText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message || !message.trim()) && (!files || files.length === 0) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={(!message || !message.trim()) && (!files || files.length === 0)}
          >
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/77e44a4ff8b7e36bf7ca87f8f3da575a38f02e5203b1124efe5c077e4627a813?placeholderIfAbsent=true&apiKey=e37e4a97f6a946f0a953c8d2923ad63f",
              }}
              style={[styles.sendIcon, (!message || !message.trim()) && (!files || files.length === 0) && { opacity: 0.5 }]}
              accessibilityLabel="Send icon"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={zoomedImage !== null} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.zoomedImageContainer}>
            {zoomedImage && <Image source={{ uri: zoomedImage }} style={styles.zoomedImage} />}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setZoomedImage(null)}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },

  inputContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  attachButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  inputWithPreviewContainer: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  inputWithPreviewPadding: {
    paddingLeft: 40,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  input: {
    minHeight: 28,
    maxHeight: 80,
    fontSize: 14,
    textAlignVertical: "bottom",
    width: "100%",
    paddingVertical: 4,
    paddingTop: 20,
    paddingBottom: 2,
    textAlign: "left",
    borderWidth: 0,
    paddingLeft: 16,
  },
  sendButton: {
    backgroundColor: "#5B7560",
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  filesPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginLeft: 28,
  },
  filePreviewContainer: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePreview: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  documentPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 4,
    borderRadius: 4,
  },
  documentIcon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  documentName: {
    fontSize: 8,
    color: "#2B2B2B",
    textAlign: "center",
  },
  removeFileButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeFileText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 18,
    width: 24,
    height: 24,
    padding: 0,
    margin: 0,
    marginTop: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomedImageContainer: {
    width: "90%",
    height: "80%",
  },
  zoomedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
    width: 50,
    height: 50,
    padding: 0,
    margin: 0,
    marginTop: -2,
  },
})

export default ChatInput