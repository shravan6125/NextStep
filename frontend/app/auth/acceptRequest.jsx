import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AcceptedRequestsPage = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    const mentorId = await AsyncStorage.getItem("mentorId");

    if (!mentorId) {
      Alert.alert("Error", "Mentor ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.137.77:3000/api/requests/accepted/${mentorId}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected API response:", data);
        return;
      }

      setAcceptedRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
      Alert.alert("Error", "Failed to fetch accepted requests.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accepted Students</Text>
      {loading ? <Text>Loading...</Text> : (
        <FlatList
          data={acceptedRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source= {require('../../assets/images/person.png')} style={styles.profileImage} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.studentName}>{item.studentId.name}</Text>
                <Text style={styles.studentEmail}>{item.studentId.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => router.push(`/auth/chat/${item.studentId._id}`)}
              >
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 15, marginBottom: 10, borderRadius: 10 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  cardTextContainer: { flex: 1 },
  studentName: { fontSize: 18, fontWeight: "bold" },
  studentEmail: { fontSize: 14, color: "#777" },
  chatButton: { backgroundColor: "#0077B6", padding: 10, borderRadius: 5 },
  chatButtonText: { color: "white", fontWeight: "bold" },
});

export default AcceptedRequestsPage;