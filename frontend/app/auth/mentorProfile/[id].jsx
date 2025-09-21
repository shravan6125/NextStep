
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert,ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MentorProfile = () => {
  const router = useRouter();
  const { id: mentorId } = useLocalSearchParams(); // Mentor ID from route params
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(""); // Track request status
  const [message, setMessage] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(true); // Show loading while checking request status

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await fetch(`http://192.168.137.77:3000/api/mentors/${mentorId}`);
        if (!response.ok) throw new Error("Failed to fetch mentor details");
        const data = await response.json();
        setMentor(data);
      } catch (err) {
        setError('Failed to load mentor details');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  // Fetch student ID
  const getStudentId = async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (!studentData) return null;
      const student = JSON.parse(studentData);
      return student._id;
    } catch (error) {
      console.error('Failed to fetch student ID:', error);
      return null;
    }
  };

  // Check request status
  useEffect(() => {
    const checkRequestStatus = async () => {
      const studentId = await getStudentId();
      if (!studentId) {
          console.log(" No student ID found");
          setCheckingStatus(false);
          return;
      }

      try {
          const response = await fetch(`http://192.168.137.77:3000/api/requests/status/${studentId}/${mentorId}`);
          const data = await response.json();
          
          console.log(" API Response:", data); // Log response

          // if (!response.ok) {
          //     console.error(" API Error:", data);
          //     Alert.alert("Error", "Failed to fetch status.");
          //     return;
          // }

          setStatus(data.status);
          // if (data.status === "accepted") {
          //     router.push(`/chat/${mentorId}`);
          // }
      } catch (error) {
          console.error(" Fetch Error:", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
          setCheckingStatus(false);
      }
    };

    checkRequestStatus();
  }, [mentorId]);

  const sendMentorshipRequest = async () => {
    const studentId = await getStudentId();
    if (!studentId) {
        Alert.alert("Error", "You must be logged in to send a request.");
        return;
    }

    if (!message.trim()) {
        Alert.alert("Error", "Please enter a message before sending the request.");
        return;
    }

    try {
        const response = await fetch("http://192.168.137.77:3000/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, mentorId, message }),
        });

        const data = await response.json();
        console.log(" Request Sent Successfully:", data);

        if (!response.ok) {
            Alert.alert("Error", data.error || "Something went wrong.");
            return;
        }

        Alert.alert("Success", data.message || "Mentorship request sent successfully!");
        setStatus("pending"); // Update UI
        setMessage("");
    } catch (error) {
        console.error("Fetch Error:", error);
        Alert.alert("Error", "Network issue. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  if (error || !mentor) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || 'Mentor not found!'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source= {require('../../../assets/images/person.png')} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{mentor.name}</Text>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>Bio</Text>
        <Text style={styles.bio}>{mentor.bio}</Text>

        {/* Request Status */}
        {checkingStatus ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : status === "accepted" ? (
          <TouchableOpacity style={styles.chatButton} onPress={() => router.push(`/auth/chat/${mentorId}`)}>
            <Text style={styles.buttonText}>Go to Chat</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Message</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />

            {/* Send Request Button */}
            <TouchableOpacity 
              style={[styles.button, status === "pending" && styles.disabledButton]} 
              onPress={sendMentorshipRequest} 
              disabled={status === "pending"}
            >
              <Text style={styles.buttonText}>
                {status === "pending" ? 'Request Sent ' : 'Send Mentorship Request'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Go Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    backgroundColor: '#F5F5F5', 
    paddingBottom: 20 
  },

  container: { 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    margin: 15,
    marginTop:50, 
    elevation: 5, 
    height:500,
  },
  
  profileHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },

  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginRight: 15 
  },

  textContainer: { flex: 1 },

  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },

  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 8, 
    color: '#333' 
  },

  bio: { 
    fontSize: 16, 
    color: '#444', 
    marginBottom: 10 
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#FFF',
    minHeight: 50,
    textAlignVertical: 'top',
  },

  button: { 
    backgroundColor: '#28A745', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },

  disabledButton: { backgroundColor: '#6C757D' },

  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  chatButton: { 
    backgroundColor: '#0077B6', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },

  backButton: { 
    backgroundColor: '#0077B6', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },

  backButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  errorText: { 
    fontSize: 18, 
    color: 'red', 
    textAlign: 'center', 
    marginTop: 20 
  },

  background: { 
    flex: 1, 
    resizeMode: 'cover', ...StyleSheet.absoluteFillObject 
  },
  
});

export default MentorProfile;

