
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MentorHomePage = () => {
  const router = useRouter();
  const [mentor, setMentor] = useState({ name: '', expertise: '', profileImage: '' });

  
  

useEffect(() => {
  const fetchMentorDetails = async () => {
    const mentorId = await AsyncStorage.getItem("mentorId");
    if (!mentorId) return;

    try {
      const response = await fetch(`http://192.168.137.77:3000/api/mentor/${mentorId}`);
      const data = await response.json();

      if (response.ok) {
        setMentor(data);
      } else {
        console.error("Error fetching mentor details:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  fetchMentorDetails();
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('../../assets/images/person.png')} // Default Profile Image for Mentor
                style={styles.profileImage}/>
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{mentor.name || 'Mentor'}</Text>
          <Text style={styles.mentorBio}>{mentor.expertise || 'Expertise'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.middleSection}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/auth/acceptRequest')}>
          <FontAwesome5 name="user-check" size={30} color="#0077B6" />
          <Text style={styles.cardTitle}>Accepted Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/auth/pendingRequest')}>
          <FontAwesome5 name="user-clock" size={30} color="#0077B6" />
          <Text style={styles.cardTitle}>Pending Requests</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/acceptRequest')}>
          <Ionicons name="chatbubbles" size={28} color="white" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/profileMentor')}>
          <Ionicons name="person-circle-outline" size={28} color="white" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  topSection: {
    backgroundColor: '#0077B6',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  mentorInfo: {
    flex: 1,
    marginLeft: 20,
  },
  mentorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  mentorBio: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  statusBadge: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 12,
  },
  middleSection: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 25,
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
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  
  notificationBadge: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0077B6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop:10,
    marginBottom:10,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
});

export default MentorHomePage;