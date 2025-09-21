import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Roadmap = () => {
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const storedRoadmap = JSON.parse(await AsyncStorage.getItem('roadmapData'));

        if (storedRoadmap) {
          const stepsArray = storedRoadmap
            .split("\n")
            .filter(line => line.trim() !== "")

            .map((step, index) => ({
              title: `Step ${index + 1}`,
              description: step,
              //icon: 'flag-checkered',
              color: ['#00B4D8', '#48CAE4'],
            }))
            .slice(0, 10);

          console.log("parded steps:", stepsArray);
          setRoadmapSteps(stepsArray);
        } else {
          console.warn("No roadmap found in storage. Fetching from API...");
          
          const response = await axios.get('https://192.168.137.77/api/roadmap');
          const stepsArray = response.data.map((step, index) => ({
            id: (index + 1).toString(),
            title: `Step ${index + 1}`,
            description: step,
            icon: 'flag-checkered',
            color: ['#00B4D8', '#48CAE4'],
          }));
          setRoadmapSteps(stepsArray);
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Career Roadmap</Text>
      {roadmapSteps.length > 0 ? (
        <Animated.FlatList
          data={roadmapSteps}
          horizontal
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * width * 0.8,
              index * width * 0.8,
              (index + 1) * width * 0.8,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View style={[styles.stepBox, { transform: [{ scale }] }]}>
                <LinearGradient colors={item.color} style={styles.gradient}>
                  <Text style={styles.stepNumber}>{item.id}</Text>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                  

                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={item.icon} size={60} color="black" style={styles.iconGlow} />
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          }}
        />
      ) : (
        <Text style={styles.noDataText}>No roadmap available. Please complete the questionnaire.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.12,
  },
  stepBox: {
    width: width * 0.78,
    height: 500,
    marginHorizontal: 15,
    marginBottom: 100,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent:'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'black',
  },
  stepTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    textAlign: 'justify',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepDescription: {
    fontSize: 18,
    color: 'black',
    textAlign:'center',
    marginTop: 10,
    lineHeight: 20,
    numberOfLines: 15,
   
  },
  iconContainer: {
    marginTop: 70,
  },
  iconGlow: {
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
});

export default Roadmap;