import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FlipHorizontal, Wifi, Usb, Circle } from 'lucide-react-native';

export default function WebcamMode() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionType, setConnectionType] = useState<'wifi' | 'usb'>('wifi');
  const [permission, requestPermission] = useCameraPermissions();

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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
    // In production, this would start/stop WebRTC streaming
    Alert.alert(
      isStreaming ? 'Stream Stopped' : 'Stream Started',
      `Webcam ${isStreaming ? 'disconnected from' : 'connected to'} PC via ${connectionType.toUpperCase()}`
    );
  };

  const toggleConnection = () => {
    setConnectionType(current => current === 'wifi' ? 'usb' : 'wifi');
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        {/* Connection Status */}
        <View style={styles.statusBar}>
          <View style={[styles.statusIndicator, { backgroundColor: isStreaming ? '#10B981' : '#EF4444' }]}>
            <Circle size={8} color="white" fill="white" />
          </View>
          <Text style={styles.statusText}>
            {isStreaming ? `Streaming via ${connectionType.toUpperCase()}` : 'Disconnected'}
          </Text>
        </View>

        {/* Camera Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <FlipHorizontal size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.streamButton, { backgroundColor: isStreaming ? '#EF4444' : '#10B981' }]} 
            onPress={toggleStreaming}
          >
            <Text style={styles.streamButtonText}>
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleConnection}>
            {connectionType === 'wifi' ? <Wifi size={24} color="white" /> : <Usb size={24} color="white" />}
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {isStreaming 
              ? `Your phone camera is now available as a webcam on your PC via ${connectionType.toUpperCase()}`
              : 'Tap "Start Stream" to use your phone as a webcam'
            }
          </Text>
        </View>
      </CameraView>
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
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
  },
  streamButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
  },
  instructionsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});