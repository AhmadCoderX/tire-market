import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

interface TooltipProps {
  text: string;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ text, visible, onClose, position }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.tooltip, { left: position.x, top: position.y }]}>
          <Text style={styles.tooltipText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 4,
    maxWidth: 250,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Tooltip; 