import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';

const QuestionnairePage = () => {
  const router = useRouter();
  const questions = [
    { question: 'what is your current education qualification?', options: ['SSC','HSC','Gradution','Other'] },
    { question: 'Which subject do you enjoy the most?', options: ['Science(Phy,Chem,Bio)', 'Computer Science/IT', 'Business & Economics', 'Arts & Design', 'Other'] },
    { question: 'How do you prefer to work?', options: ['Independently', 'In a team', 'Leading a group', 'Following a structured process', 'Other'] },
    { question: 'What is your career goal preference?', options: ['High-paying job', 'Stable & secure career', 'Career where I can help others', 'Challenging & competitive career', 'Other'] },
    { question: 'What matters most to you when choosing a career?', options: ['Job security', 'High salary', 'Passion & interest', 'Growth & learning', 'Other'] },
    { question: 'Which career fields are you currently interested in?', options: ['Engineering & Technology', 'Medical & Healthcare', 'Business & Management', 'Arts & Media', 'Other'] },
    
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [userResponses, setUserResponses] = useState({});

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowCustomInput(option === 'Other');
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowCustomInput(false);
      setSelectedOption('');
      setCustomOption('');
    }
  };
  

  const handleNext = async () => {
    if (showCustomInput && customOption === '') {
      alert("Please enter your custom option.");
      return;
    }

    const answer = showCustomInput ? customOption : selectedOption;
    
    setUserResponses(prevResponses => {
      const updatedResponses = { ...prevResponses, [questions[currentQuestion].question]: answer };

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitResponses(updatedResponses);
      }

      return updatedResponses;
    });

    setShowCustomInput(false);
    setSelectedOption('');
    setCustomOption('');
  };

  const submitResponses = async (responses) => {
    try {
      const response = await fetch("http://192.168.137.77:3000/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education: responses["what is your current education qualification?"],
          subject: responses["Which subject do you enjoy the most?"],
          workStyle: responses["How do you prefer to work?"],
          careerGoal: responses["What is your career goal preference?"],
          
          factor: responses["What matters most to you when choosing a career?"],
          interest: responses["Which career fields are you currently interested in?"],
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch roadmap");

      const data = await response.json();
      console.log("Roadmap Response:", data);

      // Store roadmap in AsyncStorage
      await AsyncStorage.setItem('roadmapData', JSON.stringify(data.roadmap));

      // Redirect to home page
      router.push("/auth/homePage");

    } catch (error) {
      console.error("Error fetching roadmap:", error);
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bg7.png'  
           
        )}
        style={styles.background}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <Text style={styles.question}>
            {questions[currentQuestion].question}
          </Text>

          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedOption === option && { backgroundColor: '#0077B6' },
              ]}
              onPress={() => handleOptionSelect(option)}>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && { color: '#FFFFFF' },
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          {showCustomInput && (
            <TextInput
              style={styles.input}
              placeholder="Enter your custom option"
              placeholderTextColor="#A8A8A8"
              value={customOption}
              onChangeText={setCustomOption}
            />
          )}

          <View style={styles.buttonContainer}>
            {/* Previous Button */}
            <TouchableOpacity
              style={[
                styles.button,
                currentQuestion === 0 && styles.disabledButton,
              ]}
              onPress={handlePrevious}
              disabled={currentQuestion === 0}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0077B6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuestionnairePage;