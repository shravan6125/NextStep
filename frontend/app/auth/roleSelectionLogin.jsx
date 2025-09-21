import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet,ImageBackground } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const RoleSelectionScreen = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <View style={styles.container}>
      <ImageBackground
              source={require('../../assets/images/bg7.png')}
              style={styles.background}
       >       
      <Text style={styles.title}>Choose your journey...</Text>

      <TouchableOpacity
        style={[
          styles.option,
          selectedRole === "Student" && styles.selectedOption,
        ]}
        onPress={() => router.push({ pathname: "/auth/signIn", params: { role: "student" } })}
      >
        <FontAwesome5 name="user-graduate" size={40} color="#0077b6" />
        <Text style={styles.optionText}>Student</Text>500
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          selectedRole === "Mentor" && styles.selectedOption,
        ]}
        onPress={() => router.push({ pathname: "/auth/signInMentor", params: { role: "mentor" } })}
      >
        <FontAwesome5 name="chalkboard-teacher" size={40} color="#0077b6" />
        <Text style={styles.optionText}>Mentor</Text>
      </TouchableOpacity>

      {selectedRole && (
        <Text style={styles.selectedText}>
          You chose: {selectedRole}. Let's begin!
        </Text>
      )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "black",
  },
  option: {
    width: "90%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: "#2ecc71",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: "#2ecc71",
    fontWeight: "bold",
  },
});

export default RoleSelectionScreen;