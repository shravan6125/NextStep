import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';

const HomePage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.name);  
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.137.77:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        console.log(" Logged in successfully:", data);
        
        // Store user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
  
        // Navigate to home page
        router.push("/homePage");
      } else {
        console.error(" Login failed:", data.message);
      }
    } catch (error) {
      console.error(" Error during login:", error);
    }
  };
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          
          <View style={styles.statusIcons}>
            
            
          </View>
        </View>
        <View style={styles.welcomeSection}>
          <Image
            source= {require('../../assets/images/person.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userName}>{setUserName||"NEHA"}</Text>
          </View>
        </View>
        <View style={styles.searchBox}>
  <Ionicons name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search mentors, skills, jobs..."
    placeholderTextColor="#B0B0B0"
  />
</View>
      </View>

      <ScrollView>
        {/* Categories Section */}
        <View style={styles.sectionHeader}></View>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.categoriesContainer}>
  
  <View style={[styles.categoryCard, styles.roadmapCard]}>
  <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/roadmap')}>
    <MaterialCommunityIcons name="map-outline" size={35} color="black" />
    <Text style={styles.categoryText}>Career Roadmaps</Text>
    </TouchableOpacity>
  </View>
  <View style={[styles.categoryCard, styles.mentorshipCard]}>
  <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/mentorPage')}>
    <FontAwesome5 name="user-friends" size={35} color="black" />
    <Text style={styles.categoryText}>Mentorship</Text>
    </TouchableOpacity>
  </View>
  <View style={[styles.categoryCard, styles.resumeCard]}>
  <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/resume')}>
    <Ionicons name="briefcase-outline" size={35} color="black" />
    <Text style={styles.categoryText}>AI Resume Scan</Text>
    </TouchableOpacity>
  </View>

  <View style={[styles.categoryCard, styles.chatCard]}>
  <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/chatbotScreen')}>
    <FontAwesome5 name="robot" size={20} color="white"  />
    <Text style={styles.chatCardText}>CareerAi</Text>
    </TouchableOpacity>
  </View>
  
</View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome5 name="home" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/roadmap')}>
          <MaterialCommunityIcons name="map-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Roadmap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/mentorPage')}>
          
          <FontAwesome5 name="user-friends" size={24} color="#FFFFFF" />
          <Text style={styles.navText}>Mentors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/auth/profile')}> 
          <Ionicons name="person-circle-outline" size={25} color="#FFFFFF" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0077B6',
    padding: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop:10,
    marginLeft:10,
    marginRight:7,
    height:200,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginTop:20,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 30,
    marginTop:15,

  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height:50,
  
  
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    paddingLeft:15,
    paddingBottom: 25,
    
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  categoryCard: {
    width: '48%', 
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    height:130,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  roadmapCard:{
    backgroundColor:"#48CAE4"
  },
  mentorshipCard:{
    backgroundColor:"#48CAE4"
  },
  resumeCard:{
    backgroundColor:"#48CAE4"
  },
  chatCard:{
    backgroundColor:"#0077B6",
    borderRadius:"100%",
    height:60,
    width:60,
    marginRight:20,
    marginTop:90,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingLeft: 10,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  cardRating: {
    fontSize: 12,
    color: '#999',
  },
  chatCardText:{
   fontSize:8,
   color:'white'
   },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0077B6',
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop:10,
    marginBottom:10,
    marginLeft:10,
    marginRight:7,


  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default HomePage;