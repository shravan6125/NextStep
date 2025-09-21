import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const ResumeScoreTracker = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled === false) {
        setSelectedFile(result.assets[0].name);
      }
    } catch (error) {
      console.error('File picking error:', error);
    }
  };

  const handleSubmit = () => {
    // Mocking score and feedback (replace with actual logic)
    const mockScore = Math.floor(Math.random() * 100);
    const mockFeedback =
      mockScore > 75
        ? 'Great resume! It is well-structured and professional.'
        : 'Needs improvement. Consider adding more details and refining formatting.';
    
    setResumeScore(mockScore);
    setFeedback(mockFeedback);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Score Tracker</Text>

      {/* File Upload Section */}
      <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
        <Text style={styles.filePickerText}>
          {selectedFile ? selectedFile : 'Upload Resume (PDF)'}
        </Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {/* Score Display */}
      {resumeScore !== null && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Resume Score:</Text>
          <Text style={styles.score}>{resumeScore}/100</Text>
        </View>
      )}

      {/* Feedback Section */}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Feedback:</Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  filePicker: {
    width: '90%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  filePickerText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#0077B6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scoreContainer: {
    marginTop: 20,
    backgroundColor: '#FFF',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 5,
  },
  feedbackContainer: {
    marginTop: 20,
    backgroundColor: '#FFF',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default ResumeScoreTracker;