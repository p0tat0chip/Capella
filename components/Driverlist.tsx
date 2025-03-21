import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const Driverlist = ({ carType }) => {
    // Dummy data for demonstration
    const cars = [
        { id: '1', type: 'sedan', eta: '5 min', fare: '$10' },
        { id: '2', type: 'sedan', eta: '7 min', fare: '$12' },
        { id: '3', type: 'luxury sedan', eta: '8 min', fare: '$20' },
        { id: '4', type: 'luxury sedan', eta: '10 min', fare: '$25' },
        { id: '5', type: 'suv', eta: '6 min', fare: '$15' },
        { id: '6', type: 'suv', eta: '9 min', fare: '$18' },
    ];

    // Filter the list based on the passed carType prop
    const filteredCars = cars.filter(car => car.type === carType);

    // Define snap points for the bottom sheet (e.g., 25% and 50% of the screen height)
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemType}>{item.type}</Text>
            <Text style={styles.itemETA}>ETA: {item.eta}</Text>
            <Text style={styles.itemFare}>Fare: {item.fare}</Text>
        </View>
    );

    // Create a ref to control the bottom sheet (if needed)
    const bottomSheetRef = useRef(null);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1} // start at the second snap point (i.e., 50%)
            snapPoints={snapPoints}
            enablePanDownToClose={false}
        >
            <View style={styles.contentContainer}>
                {filteredCars.length > 0 ? (
                    <FlatList
                        data={filteredCars}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                ) : (
                    <Text style={styles.emptyText}>No cars available for {carType}</Text>
                )}
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    itemType: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemETA: {
        fontSize: 14,
        color: '#666',
    },
    itemFare: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
});

export default Driverlist;
