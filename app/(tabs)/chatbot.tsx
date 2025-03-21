import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { chatWithGemini } from "@/hooks/useGeminiResponse"; // Adjust the import path as needed

const ChatBot = () => {
    const [messages, setMessages] = useState([]); // Each message: { id, text, sender }
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        // Append user message
        const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Call Gemini for bot response
        setLoading(true);
        try {
            const response = await chatWithGemini(inputText);
            const botMessage = { id: (Date.now() + 1).toString(), text: response, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { id: (Date.now() + 2).toString(), text: "Error: Unable to fetch response", sender: "bot" };
            setMessages((prev) => [...prev, errorMessage]);
        }
        setLoading(false);
    };

    const clearChat = () => {
        setMessages([]);
    };

    const renderMessage = ({ item }) => {
        const isBot = item.sender === "bot";
        return (
            <View style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ChatBot</Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
                    <Text style={styles.clearButtonText}>Clear Chat</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
            />
            {loading && <ActivityIndicator size="small" color="#007bff" />}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f0f0f0"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    clearButton: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    clearButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    messagesList: {
        paddingBottom: 20,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#DCF8C6",
    },
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#ECECEC",
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    sendButton: {
        backgroundColor: "#007bff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginLeft: 10,
    },
    sendButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default ChatBot;
