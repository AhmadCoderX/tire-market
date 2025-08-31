import React from "react";
import { View, StyleSheet } from "react-native";

const GridComponent = () => {
    const gridSize = 20; // Size of each grid cell
    const numRows = 12; // Number of rows
    const numCols = 20; // Number of columns

    return (
        <View style={styles.gridContainer}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {Array.from({ length: numCols }).map((_, colIndex) => (
                        <View key={colIndex} style={styles.cell} />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        position: "absolute",
        top: 50, // Adjust position as needed
        right: 20, // Position to top-right like the image
        flexDirection: "column",
        zIndex: -1, // Send it to the background
        opacity: 0.2, // Light gray effect
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: 40, // Grid cell width
        height: 40, // Grid cell height
        borderWidth: 0.5,
        borderColor: "#999696", // Light gray color
    },
});

export default GridComponent;
