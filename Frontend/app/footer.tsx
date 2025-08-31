import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

const Footer = () => {
    const isWeb = Platform.OS === "web";
    const isMobileView = !isWeb || Dimensions.get('window').width < 768;

    return (
        <View style={[
            styles.footer,
            { flexDirection: isMobileView ? 'column' : 'row' }
        ]}>
            <View style={[styles.logoSection, isMobileView && styles.mobileSection]}>
                <Text style={styles.logo}>Logo</Text>
            </View>

            <View style={[styles.section, isMobileView && styles.mobileSection]}>
                <Text style={styles.sectionTitle}>Customer Service</Text>
                <TouchableOpacity>
                    <Text style={styles.link}>About Us</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.link}>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.link}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, isMobileView && styles.mobileSection]}>
                <Text style={styles.sectionTitle}>Connect With Us</Text>
                <View style={styles.socialIcons}>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Icon name="facebook" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Icon name="camera-alt" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Icon name="chat" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Icon name="play-circle-filled" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.section, isMobileView && styles.mobileSection]}>
                <Text style={styles.sectionTitle}>Sign up for our newsletter</Text>
                <View style={styles.newsletterContainer}>
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="#666"
                        style={styles.newsletterInput}
                    />
                    <TouchableOpacity style={styles.subscribeButton}>
                        <Text style={styles.subscribeButtonText}>Subscribe</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.copyright}>
                <Text style={styles.copyrightText}>© 2024 TireHub. All rights reserved.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#374f3e',
        padding: 24,
        width: '100%',
    },
    section: {
        flex: 1,
        marginHorizontal: 16,
    },
    mobileSection: {
        marginVertical: 16,
        marginHorizontal: 0,
    },
    logoSection: {
        flex: 0.5,
    },
    logo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    link: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    socialIcon: {
        padding: 4,
    },
    newsletterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    newsletterInput: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        padding: 8,
        color: '#333',
    },
    subscribeButton: {
        backgroundColor: '#15803d',
        borderRadius: 4,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    copyright: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 16,
        width: '100%',
    },
    copyrightText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    }
});

export default Footer;