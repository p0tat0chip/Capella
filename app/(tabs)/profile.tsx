import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { CreditCard, Bell, MessageSquare, Settings, ChevronRight, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { router, Link } from 'expo-router';

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/onboarding');
                    }
                }
            ]
        );
    };

    const handlePayment = () => {
        router.push('/payment');
    }
    const handleChatBot = () => {
        router.push('/chatbot');
    }
    return (
        <SafeAreaView style={[styles.container, { marginTop: 24 }]}>
            <View style={styles.header}>
                <View style={styles.avatar} />
                <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
                <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <Pressable style={styles.menuItem} onPress={handlePayment}>
                    <View style={styles.menuItemLeft}>
                        <CreditCard size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Manage Payment Methods</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <Pressable style={styles.menuItem} onPress={handleChatBot}>
                    <View style={styles.menuItemLeft}>
                        <MessageSquare size={20} color="#007AFF" />
                        <Text style={styles.menuItemText}>Chat with Support</Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                </Pressable>
            </View>
            <View style={styles.section}>
                <Pressable style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
                    <View style={styles.menuItemLeft}>
                        <LogOut size={20} color="#FF3B30" />
                        <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                    </View>
                    <ChevronRight size={20} color="#FF3B30" />
                </Pressable>
            </View>
        </SafeAreaView>
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
    logoutButton: {
        marginTop: 8,
    },
    logoutText: {
        color: '#FF3B30',
    },
});