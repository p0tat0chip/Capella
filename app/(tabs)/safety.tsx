import React from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert
} from "react-native";
import { useSafetyAnalysisStore } from "@/store/store"; // Adjust the import path as needed

function getRatingColor(rating) {
    switch (rating) {
        case "HIGH":
            return "#28a745"; // green
        case "MEDIUM":
            return "#ffc107"; // yellow/orange
        case "LOW":
            return "#dc3545"; // red
        default:
            return "#6c757d"; // gray for unknown
    }
}

export default function SafetyAnalysisDisplay() {
    // Get the analysis data from the store.
    const analysis = useSafetyAnalysisStore((state) => state.analysis);

    const handleSOSPress = () => {
        Alert.alert("SOS", "Emergency services have been alerted!");
    };

    const handleCallEmergency = () => {
        const emergencyNumber = "911"; // Change as necessary
        Linking.openURL(`tel:${emergencyNumber}`).catch((err) =>
            console.error("Error dialing emergency number:", err)
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Safety Analysis</Text>
                {analysis ? (
                    <View>
                        <View
                            style={[
                                styles.ratingContainer,
                                { backgroundColor: getRatingColor(analysis.safetyRating) },
                            ]}
                        >
                            <Text style={styles.ratingText}>
                                Safety Rating: {analysis.safetyRating}
                            </Text>
                        </View>
                        <Text style={styles.factorText}>
                            Crime Factor: {analysis.crimeFactor}
                        </Text>
                        <Text style={styles.factorText}>
                            Lighting Factor: {analysis.lightingFactor}
                        </Text>
                        <Text style={styles.factorText}>
                            Surveillance Factor: {analysis.surveillanceFactor}
                        </Text>
                        <Text style={styles.factorText}>
                            Emergency Factor: {analysis.emergencyFactor}
                        </Text>
                    </View>
                ) : (
                    <ActivityIndicator size="large" color="#007bff" />
                )}
            </View>

            <TouchableOpacity style={styles.emergencyButton} onPress={handleCallEmergency}>
                <Text style={styles.emergencyButtonText}>Call Emergency Contact</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        padding: 20,
        justifyContent: "space-between",
    },
    sosButton: {
        backgroundColor: "#ff4d4d",
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    sosText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    spacer: {
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        width: "100%",
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    ratingContainer: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    ratingText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    factorText: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
        marginVertical: 2,
    },
    emergencyButton: {
        backgroundColor: "#007bff",
        width: 320,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginBottom: 40,
    },
    emergencyButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
