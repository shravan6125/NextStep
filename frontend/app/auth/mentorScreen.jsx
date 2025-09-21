import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const MentorListScreen = () => {
  const [mentors, setMentors] = useState([]); // Store fetched data
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch('http://192.168.137.77:3000/api/mentors'); // Replace with your actual API URL
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      const data = await response.json();
      setMentors(data); 
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false); // Hide loader after fetching data
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/bg7.png')} style={styles.background}>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredMentors}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image 
                  source={item.image ? { uri: item.image } : require('../../assets/images/person.png')} 
                  style={styles.profileImage} 
                />
                <View style={styles.mentorInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.expertise}>{item.expertise}</Text>
            
                </View>
                <TouchableOpacity 
                  style={styles.viewProfileButton} 
                  onPress={() => router.push(`/auth/mentorProfile/${item._id}`)}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  searchInput: { backgroundColor: '#FFF', 
    fontSize: 16, 
    padding: 10, 
    paddingVertical: 15, 
    borderRadius: 20, 
    marginBottom: 10, 
    marginLeft: 10, 
    marginRight: 10, 
    marginTop: 15 },

  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    marginLeft: 10, 
    marginRight: 10 
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  mentorInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  expertise: { fontSize: 14, color: '#666' },

  viewProfileButton: {
    backgroundColor: '#0077B6', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 6,
  },
  viewProfileText: { 
    color: '#FFF', 
    fontSize: 14, 
    fontWeight: 'bold' },

  background: { flex: 1, resizeMode: 'cover', ...StyleSheet.absoluteFillObject },
});

export default MentorListScreen;

