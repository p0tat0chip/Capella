import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CreditCard, Bell, MessageSquare, Settings, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar} />
                <Text style={styles.name}>John Doe</Text>
                <Text style={styles.email}>john.doe@example.com</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <CreditCard size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Manage Payment Methods</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <MessageSquare size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Chat with Support</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <Bell size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Notifications</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <Settings size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Settings</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F2F2F7',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#8E8E93',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
    },
});