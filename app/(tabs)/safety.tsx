import { SafeAreaView, Text, StyleSheet, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { CircleAlert as AlertCircle, Share2, Activity, Mic } from 'lucide-react-native';

export default function SafetyScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Safety Center</Text>

            {/* SOS Button */}
            <Pressable style={styles.sosButton}>
                <AlertCircle color="#FFFFFF" size={24} />
                <Text style={styles.sosButtonText}>Emergency SOS</Text>
            </Pressable>

            {/* Live Tracking Card */}
            <BlurView intensity={80} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Share2 size={20} color="#007AFF" />
                    <Text style={styles.cardTitle}>Live Tracking</Text>
                </View>
                <Text style={styles.cardDescription}>
                    Share your live location with trusted contacts
                </Text>
                <Pressable style={styles.shareButton}>
                    <Text style={styles.shareButtonText}>Share Trip</Text>
                </Pressable>
            </BlurView>

            {/* Safety Score Card */}
            <BlurView intensity={80} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Activity size={20} color="#007AFF" />
                    <Text style={styles.cardTitle}>Safety Score</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreBar, { width: '75%' }]} />
                </View>
                <Text style={styles.scoreText}>Area Safety: 75/100</Text>
            </BlurView>

            {/* Voice SOS Card */}
            <BlurView intensity={80} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Mic size={20} color="#007AFF" />
                    <Text style={styles.cardTitle}>Voice SOS</Text>
                </View>
                <Text style={styles.cardDescription}>
                    AI-powered voice detection for emergency situations
                </Text>
                <View style={styles.voiceStatus}>
                    <View style={styles.statusIndicator} />
                    <Text style={styles.statusText}>Listening</Text>
                </View>
            </BlurView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
    },
    sosButton: {
        backgroundColor: '#FF3B30',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    sosButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    card: {
        backgroundColor: 'rgba(242, 242, 247, 0.8)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    cardDescription: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 16,
    },
    shareButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    scoreContainer: {
        height: 8,
        backgroundColor: '#E5E5EA',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    scoreBar: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#34C759',
    },
    scoreText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    voiceStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#34C759',
    },
    statusText: {
        fontSize: 14,
        color: '#8E8E93',
    },
});