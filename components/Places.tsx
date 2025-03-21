import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Colors } from "@/constants/Colors";

const GOOGLE_PLACES_API_KEY = ""; // Replace with your actual API Key

export const GooglePlacesSearch = ({ placeholder, onSelect, inputRef }) => {
    const [query, setQuery] = useState('');
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
                            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
                        }
                    }
                );
                setSuggestions(response.data.places || []);
            } catch (err) {
                setError("Failed to fetch places. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 500), // Debounce 500ms
        []
    );

    const handleInputChange = (text) => {
        setQuery(text);
        fetchPlaces(text);
    };

    return (
        <View style={styles.container}>
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
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setQuery(item.displayName.text);
                                setSuggestions([]);
                                onSelect({
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude
                                });
                            }}
                            style={styles.suggestionItem}
                        >
                            <Text style={styles.suggestionTitle}>{item.displayName.text}</Text>
                            <Text style={styles.suggestionSubtitle}>{item.formattedAddress}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const MapWithSearch = ({ inputRef }) => {
    const [destination, setDestination] = useState(null);

    // Compute the region dynamically based on whether a destination is selected
    const region = destination ? {
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.01, // Zoom in when a destination is selected
        longitudeDelta: 0.01,
    } : {
        latitude: 28.6139, // Default location (Delhi)
        longitude: 77.2090,
        latitudeDelta: 0.1,  // Broader view initially
        longitudeDelta: 0.1,
    };

    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                region={region} // Use dynamic region instead of initialRegion
            >
                {destination && <Marker coordinate={destination} title="Destination" />}
            </MapView>

            <GooglePlacesSearch placeholder="Where to?" onSelect={setDestination} inputRef={inputRef} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        width: '90%',
        alignSelf: 'center',
        zIndex: 9999,
    },
    input: {
        borderRadius: 0,
        marginHorizontal: 10,
        color: '#000',
        borderColor: Colors.light.tint,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        height: 45,
        paddingHorizontal: 12,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        top: 25
    },
    suggestionsList: {
        backgroundColor: '#FFF',
        maxHeight: 250,
        borderRadius: 0,
        marginTop: 1,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#000',
        borderTopWidth: 0,
        top: 25
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    suggestionTitle: {
        fontSize: 16,
        color: '#000',
    },
    suggestionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusBox: {
        backgroundColor: '#F5F5F5',
        padding: 8,
        marginHorizontal: 10,
        marginTop: 5,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    statusText: {
        color: '#555',
        textAlign: 'center',
    },
    errorText: {
        color: '#D00',
        textAlign: 'center',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    }
});

export default MapWithSearch;
