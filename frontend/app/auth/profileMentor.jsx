import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const MentorProfile = () => {
  // Mentor Profile details state
  const [name, setName] = useState('Mentor');
  const [bio, setBio] = useState('Experienced Mentor | Helping Students Grow');
  const [expertise, setExpertise] = useState('Software Development, Data Science, AI');
  const [experience, setExperience] = useState('5+ years in IT Industry, Worked with MNCs');
  const [interests, setInterests] = useState('Tech Innovation, Teaching, Career Guidance');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/images/person.png')} // Default Profile Image for Mentor
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio}>{bio}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Feather name="edit" size={20} color="white" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Mentor Details */}
      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <FontAwesome5 name="laptop-code" size={24} color="#0077B6" />
          <Text style={styles.cardTitle}>Expertise</Text>
          <Text style={styles.cardText}>{expertise}</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="work" size={24} color="#0077B6" />
          <Text style={styles.cardTitle}>Experience</Text>
          <Text style={styles.cardText}>{experience}</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="star" size={24} color="#0077B6" />
          <Text style={styles.cardTitle}>Interests</Text>
          <Text style={styles.cardText}>{interests}</Text>
        </View>
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={26} color="white" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Bio" />
            <TextInput style={styles.input} value={expertise} onChangeText={setExpertise} placeholder="Expertise" />
            <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="Experience" />
            <TextInput style={styles.input} value={interests} onChangeText={setInterests} placeholder="Interests" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 280,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#005B99',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flexShrink: 1,
  },
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 3,
  },
  signOutText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default MentorProfile;


