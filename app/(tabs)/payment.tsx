import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from "expo-router";

const PaymentScreen = () => {
    const paymentMethods = [
        {
            id: '1',
            type: 'Credit Card',
            last4: '4242',
            expiry: '12/25',
            brand: 'Visa',
            isDefault: true,
        },
        {
            id: '2',
            type: 'Credit Card',
            last4: '8888',
            expiry: '06/24',
            brand: 'Mastercard',
            isDefault: false,
        },
        {
            id: '3',
            type: 'Debit Card',
            last4: '1234',
            expiry: '09/26',
            brand: 'Visa',
            isDefault: false,
        },
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Payment", headerBackVisible: false }} />
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Payment Methods</Text>
                    <Text style={styles.headerSubtitle}>Manage your payment information</Text>
                </View>

                <View style={styles.cardsContainer}>
                    {paymentMethods.map((method) => (
                        <View key={method.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{method.brand}</Text>
                                <Text style={styles.cardDescription}>
                                    {method.type} ending in {method.last4}
                                </Text>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardDetails}>
                                    <Text style={styles.expiry}>Expires {method.expiry}</Text>
                                    {method.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={styles.cardFooter}>
                                <TouchableOpacity>
                                    <Text style={styles.editButton}>Edit</Text>
                                </TouchableOpacity>
                                {!method.isDefault && (
                                    <TouchableOpacity>
                                        <Text style={styles.deleteButton}>Delete</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.addCardContainer}>
                    <Text style={styles.addCardText}>+ Add New Card</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#8E8E93',
    },
    cardsContainer: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#8E8E93',
    },
    cardContent: {
        padding: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiry: {
        fontSize: 14,
        color: '#8E8E93',
    },
    defaultBadge: {
        backgroundColor: '#E5E5EA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '500',
    },
    editButton: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    deleteButton: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
    },
    addCardContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        alignItems: 'center',
    },
    addCardText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
});