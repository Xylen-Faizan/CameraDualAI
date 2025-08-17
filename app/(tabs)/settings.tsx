import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView, Alert } from 'react-native';
import { 
  Key, 
  Globe, 
  Battery, 
  Moon, 
  Zap, 
  Camera, 
  Brain,
  Info,
  ChevronRight
} from 'lucide-react-native';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [autoScan, setAutoScan] = useState(true);
  const [batterySaver, setBatterySaver] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');
  const [ocrProvider, setOcrProvider] = useState<'mlkit' | 'tesseract'>('mlkit');

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      Alert.alert('API Key Saved', 'Your API key has been saved securely.');
      // In production, save to secure storage
    } else {
      Alert.alert('Error', 'Please enter a valid API key.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setDarkMode(true);
            setAutoScan(true);
            setBatterySaver(false);
            setApiKey('');
            setAiProvider('openai');
            setOcrProvider('mlkit');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* AI Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Brain size={20} color="#3B82F6" />
            <Text style={styles.settingLabel}>AI Provider</Text>
          </View>
          <View style={styles.providerSelector}>
            <TouchableOpacity
              style={[
                styles.providerButton,
                aiProvider === 'openai' && styles.providerButtonActive
              ]}
              onPress={() => setAiProvider('openai')}
            >
              <Text style={[
                styles.providerButtonText,
                aiProvider === 'openai' && styles.providerButtonTextActive
              ]}>
                OpenAI
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.providerButton,
                aiProvider === 'gemini' && styles.providerButtonActive
              ]}
              onPress={() => setAiProvider('gemini')}
            >
              <Text style={[
                styles.providerButtonText,
                aiProvider === 'gemini' && styles.providerButtonTextActive
              ]}>
                Gemini
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Key size={20} color="#10B981" />
            <View>
              <Text style={styles.settingLabel}>API Key</Text>
              <Text style={styles.settingDescription}>
                {aiProvider === 'openai' ? 'OpenAI' : 'Google Gemini'} API key
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.apiKeyContainer}>
          <TextInput
            style={styles.apiKeyInput}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            placeholderTextColor="#6B7280"
            secureTextEntry
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera & OCR */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Camera & OCR</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Camera size={20} color="#F59E0B" />
            <Text style={styles.settingLabel}>OCR Provider</Text>
          </View>
          <View style={styles.providerSelector}>
            <TouchableOpacity
              style={[
                styles.providerButton,
                ocrProvider === 'mlkit' && styles.providerButtonActive
              ]}
              onPress={() => setOcrProvider('mlkit')}
            >
              <Text style={[
                styles.providerButtonText,
                ocrProvider === 'mlkit' && styles.providerButtonTextActive
              ]}>
                ML Kit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.providerButton,
                ocrProvider === 'tesseract' && styles.providerButtonActive
              ]}
              onPress={() => setOcrProvider('tesseract')}
            >
              <Text style={[
                styles.providerButtonText,
                ocrProvider === 'tesseract' && styles.providerButtonTextActive
              ]}>
                Tesseract
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Zap size={20} color="#8B5CF6" />
            <View>
              <Text style={styles.settingLabel}>Auto Scan</Text>
              <Text style={styles.settingDescription}>
                Automatically detect screen changes
              </Text>
            </View>
          </View>
          <Switch
            value={autoScan}
            onValueChange={setAutoScan}
            trackColor={{ false: '#374151', true: '#3B82F6' }}
            thumbColor={autoScan ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Battery size={20} color="#EF4444" />
            <View>
              <Text style={styles.settingLabel}>Battery Saver</Text>
              <Text style={styles.settingDescription}>
                Reduce scanning frequency to save battery
              </Text>
            </View>
          </View>
          <Switch
            value={batterySaver}
            onValueChange={setBatterySaver}
            trackColor={{ false: '#374151', true: '#10B981' }}
            thumbColor={batterySaver ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Moon size={20} color="#6366F1" />
            <View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Use dark theme throughout the app
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#374151', true: '#6366F1' }}
            thumbColor={darkMode ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color="#6B7280" />
            <Text style={styles.settingLabel}>App Version</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>1.0.0</Text>
            <ChevronRight size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  providerSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  providerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#374151',
  },
  providerButtonActive: {
    backgroundColor: '#3B82F6',
  },
  providerButtonText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  providerButtonTextActive: {
    color: 'white',
  },
  apiKeyContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  apiKeyInput: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});