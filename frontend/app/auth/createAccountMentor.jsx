import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateAccountMentor = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [industry, setIndustry] = useState('');

  const handleCreateAccount = async () => {
    try {
      const response = await fetch('http://192.168.137.77:3000/api/mentors/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, expertise, experience, industry }),
      });
  
      
      const textResponse = await response.text();
      console.log(" Raw Response:", textResponse);
  
      
      const data = JSON.parse(textResponse);
  
      if (response.ok && data.mentorId) {
        await AsyncStorage.setItem("mentorId", data.mentorId.toString());
        console.log(" Mentor ID stored in AsyncStorage:", data.mentorId);
        router.push("/auth/homePageMentor");
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error(" Network error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/imageback.png')} style={styles.background}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.inputContainer}>
            <Icon name="account" size={24} color="#0077B6" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color="#0077B6" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Please enter your Password"
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

          <View style={styles.inputContainer}>
            <Icon name="briefcase" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Your Expertise (e.g., Data Science, AI)"
              placeholderTextColor="#A8A8A8"
              value={expertise}
              onChangeText={setExpertise}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="calendar" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              placeholderTextColor="#A8A8A8"
              keyboardType="numeric"
              value={experience}
              onChangeText={setExperience}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="domain" size={24} color="#0077B6" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Industry (e.g., Technology, Healthcare)"
              placeholderTextColor="#A8A8A8"
              value={industry}
              onChangeText={setIndustry}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
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
      backgroundColor: '#F8F9FA',
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      width: '90%',
      elevation: 5,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#0077B6',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#0077B6',
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: '#D1D1D1',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginBottom: 15,
      backgroundColor: '#F5F5F5',
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: '#333',
      paddingVertical: 10,
    },
    button: {
      backgroundColor: '#0077B6',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default CreateAccountMentor;