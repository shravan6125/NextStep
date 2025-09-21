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


const BACKEND_URL = "http://192.168.43.216:3000"; 

const CreateAccountPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }
  
    try {
      const response = await fetch("http://192.168.137.77:3000/auth/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }), 
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!");
        router.push("/auth/questions"); 
      } else {
        Alert.alert("Error", data.error || "Signup failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/imageback.png")}
        style={styles.background}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.inputContainer}>
            <Icon name="account" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              placeholderTextColor="#A8A8A8"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
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
              placeholder="Enter your Password"
              placeholderTextColor="#A8A8A8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-check" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your Password"
              placeholderTextColor="#A8A8A8"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0077B6",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#0077B6",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#333",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#0077B6",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateAccountPage;
