import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import debounce from "lodash.debounce";
import * as Location from "expo-location";
import { Colors } from "@/constants/Colors";
import rideOptions from "@/assets/markers";
import { chatWithGemini } from "@/hooks/useGeminiResponse";
import { useSafetyAnalysisStore } from "@/store/store";

// ---------------------------
// GooglePlacesSearch Component
// ---------------------------
const GOOGLE_PLACES_API_KEY = "AIzaSyCE6NPRhq4JC0-QbJmmNd-rwBCuvGsLytk"; // Replace with your actual API Key

const GooglePlacesSearch = ({ placeholder, onSelect, inputRef }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchPlaces = useCallback(
      debounce(async (text) => {
        if (text.length < 3) {
          setSuggestions([]);
          return;
        }
        setLoading(true);
        setError("");

        try {
          const response = await axios.post(
              "https://places.googleapis.com/v1/places:searchText",
              { textQuery: text },
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                  "X-Goog-FieldMask":
                      "places.displayName,places.formattedAddress,places.location",
                },
              }
          );
          setSuggestions(response.data.places || []);
        } catch (err) {
          setError("Failed to fetch places. Please try again.");
        } finally {
          setLoading(false);
        }
      }, 500),
      []
  );

  const handleInputChange = (text) => {
    setQuery(text);
    fetchPlaces(text);
  };

  return (
      <View style={styles.searchContainer}>
        <TextInput
            ref={inputRef}
            value={query}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor="#888"
            style={styles.input}
        />

        {loading && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Loading...</Text>
            </View>
        )}

        {error ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
        ) : null}

        {suggestions.length > 0 && (
            <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                style={styles.suggestionsList}
                renderItem={({ item }) => {
                  // Safely determine the display name
                  const displayName =
                      typeof item.displayName === "object"
                          ? item.displayName.text
                          : item.displayName;
                  return (
                      <TouchableOpacity
                          onPress={() => {
                            const location = {
                              latitude: item.location.latitude,
                              longitude: item.location.longitude,
                              address: item.formattedAddress,
                            };

                            // Check if the address is set properly
                            if (!location.address || location.address.trim() === "") {
                              Alert.alert("Error", "Destination address is not set properly.");
                              return;
                            }

                            setQuery(displayName);
                            setSuggestions([]);
                            onSelect(location);
                          }}
                          style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionTitle}>{displayName}</Text>
                        <Text style={styles.suggestionSubtitle}>
                          {item.formattedAddress}
                        </Text>
                      </TouchableOpacity>
                  );
                }}
            />
        )}
      </View>
  );
};

// ---------------------------
// Helper: parseGeminiResponse
// ---------------------------
function parseGeminiResponse(responseText) {
  const safetyRatingMatch = responseText.match(
      /\[Safety Rating:\s*(HIGH|MEDIUM|LOW)\]/i
  );
  const crimeMatch = responseText.match(/\[Crime Factor:\s*([^\]]+)\]/i);
  const lightingMatch = responseText.match(/\[Lighting Factor:\s*([^\]]+)\]/i);
  const surveillanceMatch = responseText.match(
      /\[Surveillance Factor:\s*([^\]]+)\]/i
  );
  const emergencyMatch = responseText.match(
      /\[Emergency Factor:\s*([^\]]+)\]/i
  );
  return {
    safetyRating: safetyRatingMatch ? safetyRatingMatch[1].toUpperCase() : "UNKNOWN",
    crimeFactor: crimeMatch ? crimeMatch[1].trim() : "Data unavailable",
    lightingFactor: lightingMatch ? lightingMatch[1].trim() : "Data unavailable",
    surveillanceFactor: surveillanceMatch ? surveillanceMatch[1].trim() : "Data unavailable",
    emergencyFactor: emergencyMatch ? emergencyMatch[1].trim() : "Data unavailable",
  };
}

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

// ---------------------------
// SafetyAnalysisCard Component
// ---------------------------
function SafetyAnalysisCard({ destination }) {
  const [parsedResult, setParsedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const setAnalysis = useSafetyAnalysisStore((state) => state.setAnalysis);

  useEffect(() => {
    if (!destination) return;
    const predefinedPrompt = `
You are a highly skilled safety assessment AI. Given a specific address or place name provided by the user, conduct a thorough analysis of its safety based exclusively on publicly available data. Your analysis must consider crime rates, street lighting conditions, the presence of public surveillance and policing, and the accessibility and responsiveness of local emergency services.

Input: ${destination}

Analysis Requirements:

Crime Data Acquisition & Interpretation: Scrutinize recent publicly available crime statistics from official law enforcement sources. Identify prevalent crime types and assess their frequency and trends. Note any limitations in data availability, recency, or granularity.

Street Lighting Evaluation: Investigate the quality and extent of street lighting, particularly during nighttime hours. Utilize resources such as Google Maps Street View and credible community reports.

Public Safety Infrastructure Assessment: Determine the presence of public safety measures such as visible CCTV cameras, frequency of police patrols, and active neighborhood watch programs.

Emergency Services Responsiveness Research: Investigate the responsiveness of local emergency services, including average response times and any known access challenges.

Constraint: Your output must strictly adhere to the following format. Each 'Factor' line must contain a maximum of three words, concisely summarizing your data-driven assessment. If insufficient data exists for a factor, use "Data unavailable".

Output Format:

[Safety Rating: (HIGH, MEDIUM, or LOW)]
[Crime Factor: (Three words max)]
[Lighting Factor: (Three words max)]
[Surveillance Factor: (Three words max)]
[Emergency Factor: (Three words max)]
`;

    async function fetchResponse() {
      try {
        const geminiResponse = await chatWithGemini(predefinedPrompt);
        const result = parseGeminiResponse(geminiResponse);
        setParsedResult(result);
        // Update the store with the analysis result
        setAnalysis(result);
      } catch (error) {
        console.error("Error fetching Gemini response:", error);
        const errorResult = {
          safetyRating: "UNKNOWN",
          crimeFactor: "Data unavailable",
          lightingFactor: "Data unavailable",
          surveillanceFactor: "Data unavailable",
          emergencyFactor: "Data unavailable",
        };
        setParsedResult(errorResult);
        setAnalysis(errorResult);
      }
      setLoading(false);
    }
    fetchResponse();
  }, [destination, setAnalysis]);

  if (!destination) return null;

  const handleSOSPress = () => {
    Alert.alert("SOS", "Emergency services have been alerted!");
  };

  const handleCallEmergency = () => {
    const emergencyNumber = "911"; // Change as needed
    Linking.openURL(`tel:${emergencyNumber}`).catch((err) =>
        console.error("Error dialing emergency number:", err)
    );
  };

  return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safety Analysis</Text>
        {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
        ) : (
            parsedResult && (
                <View>
                  <View
                      style={[
                        styles.ratingContainer,
                        { backgroundColor: getRatingColor(parsedResult.safetyRating) },
                      ]}
                  >
                    <Text style={styles.ratingText}>
                      Safety Rating: {parsedResult.safetyRating}
                    </Text>
                  </View>
                  <Text style={styles.factorText}>
                    Crime Factor: {parsedResult.crimeFactor}
                  </Text>
                  <Text style={styles.factorText}>
                    Lighting Factor: {parsedResult.lightingFactor}
                  </Text>
                  <Text style={styles.factorText}>
                    Surveillance Factor: {parsedResult.surveillanceFactor}
                  </Text>
                  <Text style={styles.factorText}>
                    Emergency Factor: {parsedResult.emergencyFactor}
                  </Text>
                </View>
            )
        )}
      </View>
  );
}

// ---------------------------
// ServiceTypes Component
// ---------------------------
const ServiceTypes = ({ inputRef }) => {
  const [selectedCard, setSelectedCard] = useState("");

  function handlePress(marker) {
    setSelectedCard(marker.name);
    inputRef.current?.focus();
  }

  return (
      <FlatList
          horizontal
          data={rideOptions}
          keyExtractor={(item) => item.name}
          renderItem={({ item: marker }) => (
              <Pressable
                  onPress={() => handlePress(marker)}
                  style={
                    marker.name === selectedCard
                        ? styles.activeMarkerButton
                        : styles.markerButton
                  }
              >
                <View style={styles.markerInfo}>
                  <Text style={styles.markerName}>{marker.name}</Text>
                  <Text style={styles.markerDescription}>{marker.type}</Text>
                </View>
              </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
      />
  );
};

// ---------------------------
// HomeScreen Component
// ---------------------------
const HomeScreen = () => {
  const searchRef = useRef(null);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState("Location Loading...");
  const [destination, setDestination] = useState(null);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);

  const checkIfLocationEnabled = async () => {
    try {
      let enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert("Location not enabled", "Please enable your Location", [
          { text: "Cancel", style: "cancel" },
          { text: "OK" },
        ]);
      }
      setLocationServicesEnabled(enabled);
    } catch (error) {
      console.error("Error checking location services:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Allow the app to use location services", [
          { text: "Cancel", style: "cancel" },
          { text: "OK" },
        ]);
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
        let response = await Location.reverseGeocodeAsync({ latitude, longitude });
        for (let item of response) {
          let addr = `${item.name} ${item.city} ${item.postalCode}`;
          setDisplayCurrentAddress(addr);
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  const region = destination
      ? {
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
      : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.textLocation}>{displayCurrentAddress}</Text>
          </View>
          <GooglePlacesSearch
              placeholder={"Where to?"}
              inputRef={searchRef}
              onSelect={(location) => setDestination(location)}
          />
          {/* Render SafetyAnalysisCard immediately below the destination input */}
          <SafetyAnalysisCard destination={destination ? destination.address : null} />
        </View>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={region}>
            {destination && (
                <Marker
                    coordinate={{
                      latitude: destination.latitude,
                      longitude: destination.longitude,
                    }}
                    title="Destination"
                    description={destination.address}
                />
            )}
          </MapView>
        </View>
        <View style={styles.markerListContainer}>
          <ServiceTypes inputRef={searchRef} />
        </View>
      </SafeAreaView>
  );
};

export default HomeScreen;

// ---------------------------
// Styles
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topContainer: {
    zIndex: 9999,
    paddingTop: 45,
    paddingHorizontal: 10,
  },
  searchBox: {
    marginBottom: 10,
  },
  textLocation: {
    borderRadius: 8,
    color: "#000",
    backgroundColor: "#FFFFFF",
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "500",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    marginBottom: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  input: {
    borderRadius: 5,
    color: "#000",
    backgroundColor: Colors.light.background,
    height: 45,
    paddingHorizontal: 12,
    fontSize: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  suggestionsList: {
    backgroundColor: "#FFF",
    maxHeight: 250,
    marginTop: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  suggestionTitle: {
    fontSize: 16,
    color: "#000",
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusBox: {
    backgroundColor: "#F5F5F5",
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
  errorText: {
    color: "#D00",
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerListContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  activeMarkerButton: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.background,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
    width: 250,
  },
  markerButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    width: 250,
  },
  markerInfo: {
    flex: 1,
  },
  markerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  markerDescription: {
    fontSize: 12,
    marginTop: 5,
  },
  // Card styles for Safety Analysis
  card: {
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
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
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sosButton: {
    backgroundColor: "#ff4d4d",
    width: 100,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emergencyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
