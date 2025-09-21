import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

//  Set your backend URL
const SOCKET_URL = "http://192.168.137.77:3000";

const ChatPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id is the chat partner (mentor or student)
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const socket = useRef(null);
  const [userId, setUserId] = useState(null);

  //  Fetch userId from AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };
    getUserId();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    socket.current = io(SOCKET_URL);
    if (userId) {
      socket.current.emit("join", { userId });
    }

    socket.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !id) return;
      try {
        const response = await fetch(`${SOCKET_URL}/api/chat/${userId}/${id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    fetchMessages();
  }, [userId, id]);

  
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const senderId = await AsyncStorage.getItem("userId"); //  Get sender ID
    if (!senderId) {
        console.error(" No sender ID found!");
        return;
    }

    const newMessage = {
      senderId,
      receiverId: id, // id comes from route params
      message: inputText,
    };

    console.log(" Sending message:", newMessage); // Debug log

    //  Send message via API
    await fetch(`${SOCKET_URL}/api/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    //  Emit message to WebSocket
    socket.current.emit("sendMessage", newMessage);

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(false);
};
  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/auth/acceptRequest")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: "https://i.imgur.com/4Y9vNQw.png" }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>Chat</Text>
          <Text style={styles.status}>{isTyping ? "Typing..." : "Online"}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.senderId === userId ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.messageInfo}>
              <Text style={styles.timestamp}>Now</Text>
              {item.senderId === userId && (
                <MaterialIcons name="done-all" size={16} color={item.read ? "#0A84FF" : "#999"} />
              )}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setIsTyping(text.length > 0);
          }}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0077B6",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  backButton: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  status: {
    fontSize: 12,
    color: "white",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0077B6",
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#0077B6",
    padding: 10,
    borderRadius: 25,
    elevation: 3,
  },
});

export default ChatPage;
