import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingRequestPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState(null);


  useEffect(() => {
    const fetchMentorId = async () => {
      try {
        const storedMentorId = await AsyncStorage.getItem("mentorId");
        if (storedMentorId) {
          setMentorId(storedMentorId);
          fetchPendingRequests(storedMentorId);
        } else {
          console.error(" No mentor ID found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error retrieving mentor ID:", error);
      }
    };
    fetchMentorId();
  }, []);

  // Fetch Pending Requests from API
  const fetchPendingRequests = async (mentorId) => {
    try {
      console.log(" Fetching Requests for Mentor ID:", mentorId);

      const response = await fetch(`http://192.168.137.77:3000/api/requests/${mentorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      console.log(" Pending Requests Data:", data);
      setPendingRequests(data);
    } catch (error) {
      console.error(" Error fetching pending requests:", error);
      Alert.alert("Error", "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept or Reject Request
  const handleRequestAction = async (requestId, action) => {
    try {
      console.log(` Sending ${action.toUpperCase()} request for ID:`, requestId);

      const response = await fetch(`http://192.168.137.77:3000/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      const result = await response.json();
      console.log(` API Response for ${action}:`, result);

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${action} request`);
      }

      Alert.alert("Success", `Request ${action}ed successfully!`);

      //  Update UI: Remove accepted/rejected request
      setPendingRequests((prevRequests) => prevRequests.filter(req => req._id !== requestId));

    } catch (error) {
      console.error(` Error updating request:`, error);
      Alert.alert("Error", `Failed to ${action} request.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9370DB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Requests</Text>
      {pendingRequests.length === 0 ? (
        <Text style={styles.noRequestsText}>No pending requests</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
               <Image source= {require('../../assets/images/person.png')} style={styles.profileImage} />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.studentName}>{item.studentId.name}</Text>
                  <Text style={styles.studentInterest}>Email: {item.studentId.email}</Text>
                  <Text style={styles.studentReason}>Message: {item.message}</Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleRequestAction(item._id, "accepted")}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleRequestAction(item._id, "rejected")}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

//  Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  noRequestsText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  studentInterest: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  studentReason: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  acceptButton: {
    backgroundColor: '#0077B6',
  },
  rejectButton: {
    backgroundColor: '#0077B6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PendingRequestPage;
