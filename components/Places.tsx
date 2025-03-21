import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Colors } from "@/constants/Colors";
import { useDestinationStore, useLatitudeStore, useLongitudeStore } from "@/store/store";

const GOOGLE_PLACES_API_KEY = "AIzaSyCE6NPRhq4JC0-QbJmmNd-rwBCuvGsLytk"; // Replace with your actual API Key

export const GooglePlacesSearch = ({ placeholder, onSelect, inputRef }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const setDestination = useDestinationStore((state) => state.setDestination);
    const setLatitude = useLatitudeStore((state) => state.setLatitude);
    const setLongitude = useLongitudeStore((state) => state.setLongitude);

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
        }, 500),
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
                    renderItem={({ item }) => {
                        // Safely determine the display name
                        const displayName = typeof item.displayName === 'object' ? item.displayName.text : item.displayName;
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setQuery(displayName);
                                    setSuggestions([]);
                                    const location = {
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude,
                                        address: item.formattedAddress,
                                    };
                                    onSelect(location);
                                    setDestination(location.address);
                                    setLatitude(location.latitude);
                                    setLongitude(location.longitude);
                                }}
                                style={styles.suggestionItem}
                            >
                                <Text style={styles.suggestionTitle}>{displayName}</Text>
                                <Text style={styles.suggestionSubtitle}>{item.formattedAddress}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
            <Text></Text>
        </View>
    );
};

const MapWithSearch = ({ inputRef }) => {
    const destination = useDestinationStore((state) => state.destination);
    const latitude = useLatitudeStore((state) => state.latitude);
    const longitude = useLongitudeStore((state) => state.longitude);
    const coord = { latitude: latitude, longitude: longitude };
    const region = destination ? {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    } : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region}>
                {destination && <Marker coordinate={coord} title="Destination" description={destination} />}
            </MapView>
            <GooglePlacesSearch placeholder="Where to?" onSelect={() => {}} inputRef={inputRef} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        width: '90%',
        alignSelf: 'center',
        zIndex: 9999,
    },
    input: {
        borderRadius: 5,
        marginHorizontal: 10,
        color: '#000',
        backgroundColor: Colors.light.background,
        height: 45,
        paddingHorizontal: 12,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
    },
    suggestionsList: {
        backgroundColor: '#FFF',
        maxHeight: 250,
        marginTop: 5,
        marginHorizontal: 10,
        elevation: 3,
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
        borderRadius: 5,
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
