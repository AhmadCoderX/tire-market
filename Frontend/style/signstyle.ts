import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DAD7CD",
    },
    formContainer: {
        width: "80%",
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#A3B18A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#344E41",
    },
    input: {
        borderWidth: 1,
        borderColor: "#588157",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
    },
    buttonContainer: {
        marginTop: 20,
    },
});