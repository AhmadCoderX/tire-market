import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ rating, comment });
      setIsSubmitting(false); // Reset submitting state after successful submission
      // Form will be closed by parent component on success
    } catch (error: any) {
      setError(error.message || 'Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Write a Review</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.star,
                    rating >= star && styles.selectedStar,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.textArea, error && styles.textAreaError]}
            value={comment}
            onChangeText={(text) => {
              setComment(text);
              if (text.trim()) setError(""); // Clear error when user types
            }}
            placeholder="Write your review here..."
            placeholderTextColor="#666666"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            accessibilityLabel="Write your review"
            editable={!isSubmitting}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
                error && styles.submitButtonError
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Submit review"
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Arial",
    fontSize: 20,
    fontWeight: "600",
    color: "#3A593F",
    marginBottom: 5,
    textAlign: "left",
  },
  ratingSelector: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  star: {
    fontSize: 36,
    color: "#D1D1D1",
    marginHorizontal: 5,
  },
  selectedStar: {
    color: "#FFD700",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#AEBB9F",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Arial",
    fontSize: 14,
    minHeight: 100,
    marginBottom: 10,
    color: "#666666",
  },
  textAreaError: {
    borderColor: "#FF3B30",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "#FF3B30",
    fontFamily: "Arial",
    fontSize: 12,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    color: "#3A593F",
  },
  submitButton: {
    backgroundColor: "#3A593F",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  submitButtonDisabled: {
    backgroundColor: "#AEBB9F",
  },
  submitButtonError: {
    backgroundColor: "#FF3B30",
  },
  submitButtonText: {
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default ReviewForm;