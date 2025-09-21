import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MentorLoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.137.77:3000/api/mentors/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert("Error", data.error || "Login failed");
        return;
      }
  
      console.log(" Mentor Logged In:", data);
      
      
      await AsyncStorage.setItem("mentorId", data.mentorId);
      await AsyncStorage.setItem("userId", data.mentorId);  
  
      Alert.alert("Success", "Login successful!");
      router.push("/auth/homePageMentor");
    } catch (error) {
      console.error(" Login Error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };



  return (
    <View style={styles.container}>
      {/* Background Design */}
      <ImageBackground
        source={require("../../assets/images/imageback.png")}
        style={styles.background}
      >
        <View style={styles.formContainer}>
          {/* Title */}
          <Text style={styles.title}>Mentor Login</Text>
          <Text style={styles.subtitle}>Sign in to Continue</Text>

          {/* Input Fields with Icons */}
          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A8A8A8"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A8A8A8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  background: { flex: 1, resizeMode: "cover", justifyContent: "center", alignItems: "center" },
  formContainer: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 20, width: "90%", elevation: 5, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#0077B6", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#0077B6", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", width: "100%", borderWidth: 1, borderColor: "#D1D1D1", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5, marginBottom: 15, backgroundColor: "#F5F5F5" },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#333", paddingVertical: 10 },
  button: { backgroundColor: "#0077B6", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 50, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default MentorLoginScreen;