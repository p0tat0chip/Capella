import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image, SafeAreaView,
} from "react-native";
import rideOptions from "@/assets/markers";
import {Colors} from "@/constants/Colors";
import MapWithSearch from "@/components/Places";
import {Google} from "@expo/config-plugins/build/ios";
import GooglePlacesSearch from "@/components/Places";
import {BorderlessButton} from "react-native-gesture-handler";

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
                  <Text style={styles.markerDescription}>
                    {marker.type}
                  </Text>
                </View>
              </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
      />
  )
}

const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const searchRef = useRef(null);
  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesSearch placeholder={"Where to ?"} onSelect={() => None} inputRef={searchRef} />
      <View style={styles.markerListContainer}>
        <ServiceTypes inputRef={searchRef} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.background,
    borderWidth: 2,
    borderRadius: 10, // Rounded corners for a softer look
    padding: 12,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10, // Higher elevation for Android
    width: 250,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  markerButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 10, // Rounded corners
    padding: 12,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    width: 250,
  },
  markerImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 10,
  },
  markerInfo: {
    flex: 1,
    color: Colors.dark.text,
  },
  markerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  markerDescription: {
    fontSize: 12,
    marginTop: 5,
    color: Colors.dark.text,
  },
});
export default HomeScreen;
