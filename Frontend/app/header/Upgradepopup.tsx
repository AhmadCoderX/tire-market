"use client"

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { X } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { updateProfile } from '../services/api';

// Styles object containing all component styles
const styles = StyleSheet.create({
    // Modal container
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 600,
    },

    // Close button
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        zIndex: 1,
    },

    // Header section
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },

    // Toggle section
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 24,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    toggleButtonActive: {
        backgroundColor: '#3A593F',
    },
    toggleText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '500',
    },
    toggleTextActive: {
        color: 'white',
    },

    // Pricing cards container
    cardsContainer: {
        flexDirection: 'row',
        gap: 16,
    },

    // Card common styles
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 16,
    },
    premiumCard: {
        backgroundColor: '#F5F5F5',
    },
    cardHeader: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardPrice: {
        fontSize: 32,
        fontWeight: 'bold',
    },

    // Features list
    featuresList: {
        marginBottom: 24,
    },
    featureItem: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 12,
    },

    // Action buttons
    currentPlanButton: {
        backgroundColor: '#EBEEEC',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    currentPlanButtonText: {
        color: '#3A593F',
        fontSize: 16,
        fontWeight: '500',
    },
    upgradeButton: {
        backgroundColor: '#3A593F',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
})

interface PricingModalProps {
    visible: boolean;
    onClose: () => void;
    onUpgradeConfirm: () => void;
}

export default function PricingModal({ visible, onClose, onUpgradeConfirm }: PricingModalProps) {
    const router = useRouter();
    const [isMonthly, setIsMonthly] = useState(true);
    const premiumPrice = isMonthly ? "$10" : "$120";

    const handleUpgrade = async () => {
        try {
            // Get the authentication token
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Error', 'You need to be logged in to upgrade.');
                return;
            }
            
            // Update the business status on the server
            await updateProfile(token, { is_business: true });
            
            // Update the local user data
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const currentData = JSON.parse(data);
                const updatedData = {
                    ...currentData,
                    is_business: true,
                    accountType: 'business',
                    businessHours: {
                        Monday: { isOpen: true, from: '9:00 AM', to: '6:00 PM' },
                        Tuesday: { isOpen: true, from: '9:00 AM', to: '6:00 PM' },
                        Wednesday: { isOpen: true, from: '9:00 AM', to: '6:00 PM' },
                        Thursday: { isOpen: true, from: '9:00 AM', to: '6:00 PM' },
                        Friday: { isOpen: true, from: '9:00 AM', to: '6:00 PM' },
                        Saturday: { isOpen: true, from: '10:00 AM', to: '4:00 PM' },
                        Sunday: { isOpen: false, from: '', to: '' }
                    },
                    services: [
                        'Flat Tire Repair',
                        'Wheel Balancing',
                        'Tire Installation',
                        'Brake Service'
                    ],
                    timezone: 'UTC-05:00',
                    shopName: currentData.shopName || 'My Tire Shop',
                    shopAddress: currentData.shopAddress || '123 Business Street',
                    ads: [
                        {
                            title: "Premium Tire Service",
                            price: "$89.99",
                            image: "default_image_url"
                        },
                        {
                            title: "Complete Wheel Package",
                            price: "$199.99",
                            image: "default_image_url"
                        }
                    ]
                };
                
                console.log('Upgrading user account to business:', updatedData);
                await AsyncStorage.setItem('userData', JSON.stringify(updatedData));

                // Call the onUpgradeConfirm callback to notify parent component
                onUpgradeConfirm();

                // Close the modal
                onClose();

                // Navigate to the new details page
                router.push('./newdetails');
                
                // Show success message
                Alert.alert('Success', 'Your account has been upgraded to Business status!');
            }
        } catch (error) {
            console.error('Error upgrading account:', error);
            Alert.alert('Error', 'Failed to upgrade your account. Please try again.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <X size={20} color="#000" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={styles.title}>Upgrade Your Plan</Text>

                    {/* Billing Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, isMonthly && styles.toggleButtonActive]}
                            onPress={() => setIsMonthly(true)}
                        >
                            <Text style={[styles.toggleText, isMonthly && styles.toggleTextActive]}>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, !isMonthly && styles.toggleButtonActive]}
                            onPress={() => setIsMonthly(false)}
                        >
                            <Text style={[styles.toggleText, !isMonthly && styles.toggleTextActive]}>Annually</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pricing Cards */}
                    <View style={styles.cardsContainer}>
                        {/* Free Plan */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Free Plan</Text>
                                <Text style={styles.cardPrice}>$0</Text>
                            </View>
                            <View style={styles.featuresList}>
                                <Text style={styles.featureItem}>List up to 5 tires for sale</Text>
                                <Text style={styles.featureItem}>Basic profile with contact details</Text>
                                <Text style={styles.featureItem}>Browse and search listings</Text>
                            </View>
                            <TouchableOpacity style={styles.currentPlanButton}>
                                <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Premium Plan */}
                        <View style={[styles.card, styles.premiumCard]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Premium Plan</Text>
                                <Text style={styles.cardPrice}>{premiumPrice}</Text>
                            </View>
                            <View style={styles.featuresList}>
                                <Text style={styles.featureItem}>Unlimited tire listings</Text>
                                <Text style={styles.featureItem}>Dedicated business profile</Text>
                                <Text style={styles.featureItem}>Showcase services & branding</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.upgradeButton}
                                onPress={handleUpgrade}
                            >
                                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}