import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MentorScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/*Icon */}
      <View style={styles.navButton}>
      <MaterialCommunityIcons name="account-group" size={200  } color="white" />
      </View>

      {/* Text */}
      <Text style={styles.title}>Find your mentor</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/mentorScreen')}>
        <Text style={styles.buttonText}>Let’s Start →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    alignItems: 'center',
  },
  
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#005B99',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
  },
});

export default MentorScreen;