import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DAD7CD',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: '#3A5A40',
    },
    navButton: {
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#588157',
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    heroSection: {
        alignItems: 'center',
        padding: 40,
    },
    heroLogo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#344E41',
    },
    subtitle: {
        fontSize: 16,
        color: '#A3B18A',
    },
});


