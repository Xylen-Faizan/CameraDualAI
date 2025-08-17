import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Zap, Eye, Brain, Loader } from 'lucide-react-native';

interface DetectedQuestion {
  text: string;
  confidence: number;
  timestamp: number;
}

interface AIAnswer {
  question: string;
  answer: string;
  timestamp: number;
}

export default function ScannerMode() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedQuestion, setDetectedQuestion] = useState<DetectedQuestion | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<AIAnswer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Mock OCR detection
  const mockQuestions = [
    "What is the capital of France?",
    "How do you calculate compound interest?",
    "What is the difference between React and Vue?",
    "Explain the concept of machine learning",
    "What are the benefits of renewable energy?"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScanning) {
      interval = setInterval(() => {
        // Simulate screen change detection and OCR
        const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
        const newQuestion: DetectedQuestion = {
          text: randomQuestion,
          confidence: 0.85 + Math.random() * 0.15,
          timestamp: Date.now()
        };
        
        // Only process if it's a different question
        if (!detectedQuestion || detectedQuestion.text !== newQuestion.text) {
          setDetectedQuestion(newQuestion);
          processWithAI(newQuestion.text);
        }
      }, 5000); // Scan every 5 seconds for demo
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isScanning, detectedQuestion]);

  const processWithAI = async (question: string) => {
    setIsProcessing(true);
    
    try {
      // Mock AI response - in production, this would call OpenAI/Gemini API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const mockAnswers: { [key: string]: string } = {
        "What is the capital of France?": "The capital of France is Paris. It's located in the north-central part of the country and is known for landmarks like the Eiffel Tower and Louvre Museum.",
        "How do you calculate compound interest?": "Compound interest is calculated using A = P(1 + r/n)^(nt), where A is final amount, P is principal, r is annual interest rate, n is compounding frequency, and t is time in years.",
        "What is the difference between React and Vue?": "React is a library focused on UI components with a larger ecosystem, while Vue is a progressive framework with built-in features like routing and state management, offering a gentler learning curve.",
        "Explain the concept of machine learning": "Machine learning is a subset of AI where computers learn patterns from data without explicit programming. It uses algorithms to make predictions or decisions based on training data.",
        "What are the benefits of renewable energy?": "Renewable energy offers environmental benefits (reduced emissions), economic advantages (job creation, energy independence), and sustainability (inexhaustible resources like solar and wind)."
      };

      const answer = mockAnswers[question] || "I'm not sure about that specific question. Could you provide more context?";
      
      const aiResponse: AIAnswer = {
        question,
        answer,
        timestamp: Date.now()
      };
      
      setCurrentAnswer(aiResponse);
      
      // Save to history (in production, this would use AsyncStorage or database)
      console.log('Saving to history:', aiResponse);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process question with AI');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      setDetectedQuestion(null);
      setCurrentAnswer(null);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        {/* Scanning Overlay */}
        {isScanning && (
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Point camera at PC screen</Text>
          </View>
        )}

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={[styles.statusIndicator, { backgroundColor: isScanning ? '#10B981' : '#6B7280' }]}>
            <Eye size={12} color="white" />
          </View>
          <Text style={styles.statusText}>
            {isScanning ? 'Scanning for questions...' : 'Scanner inactive'}
          </Text>
          {isProcessing && <Loader size={16} color="white" />}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.scanButton, { backgroundColor: isScanning ? '#EF4444' : '#10B981' }]} 
            onPress={toggleScanning}
          >
            <Zap size={24} color="white" />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Answer Overlay */}
      {currentAnswer && (
        <View style={styles.answerOverlay}>
          <View style={styles.answerContainer}>
            <View style={styles.answerHeader}>
              <Brain size={20} color="#3B82F6" />
              <Text style={styles.answerHeaderText}>AI Answer</Text>
            </View>
            
            <Text style={styles.questionText}>{currentAnswer.question}</Text>
            
            <ScrollView style={styles.answerScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.answerText}>{currentAnswer.answer}</Text>
            </ScrollView>
            
            <Text style={styles.timestampText}>
              {new Date(currentAnswer.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}

      {/* Detection Info */}
      {detectedQuestion && (
        <View style={styles.detectionInfo}>
          <Text style={styles.detectionText}>
            Detected: {detectedQuestion.text.substring(0, 50)}...
          </Text>
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(detectedQuestion.confidence * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  answerOverlay: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
  },
  answerContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  answerHeaderText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  questionText: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  answerScrollView: {
    maxHeight: 120,
    marginBottom: 8,
  },
  answerText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  timestampText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'right',
  },
  detectionInfo: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
  },
  detectionText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  confidenceText: {
    color: '#10B981',
    fontSize: 12,
  },
});