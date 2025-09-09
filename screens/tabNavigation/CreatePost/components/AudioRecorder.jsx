import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioRecorder = ({visible, onClose, onAudioRecorded}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const recordingInterval = useRef(null);
  const playbackInterval = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      // Start pulsing animation
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isRecording) pulse();
        });
      };
      pulse();

      // Start recording timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordedAudio(null);
    // Here you would integrate with actual audio recording library
    console.log('Starting audio recording...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate recorded audio data
    const audioData = {
      uri: 'mock-audio-uri',
      duration: recordingTime,
      size: recordingTime * 1024, // mock size
    };
    setRecordedAudio(audioData);
    console.log('Stopped recording, duration:', recordingTime);
  };

  const playRecording = () => {
    if (!recordedAudio) return;
    
    setIsPlaying(true);
    setPlaybackTime(0);
    
    // Simulate playback
    playbackInterval.current = setInterval(() => {
      setPlaybackTime(prev => {
        if (prev >= recordedAudio.duration) {
          setIsPlaying(false);
          clearInterval(playbackInterval.current);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
    }
  };

  const confirmRecording = () => {
    if (!recordedAudio) return;
    
    onAudioRecorded(recordedAudio);
    resetRecorder();
    onClose();
  };

  const deleteRecording = () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetRecorder();
          },
        },
      ]
    );
  };

  const resetRecorder = () => {
    setIsRecording(false);
    setRecordedAudio(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setPlaybackTime(0);
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    if (playbackInterval.current) clearInterval(playbackInterval.current);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.container,
          {transform: [{translateY: slideAnim}]},
        ]}>
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Audio Recorder</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Recording Area */}
        <View style={styles.recordingArea}>
          {!recordedAudio ? (
            // Recording Interface
            <View style={styles.recordingInterface}>
              {isRecording && (
                <Text style={styles.recordingTime}>
                  {formatTime(recordingTime)}
                </Text>
              )}
              
              <Animated.View style={[
                styles.recordButton,
                isRecording && styles.recordingButton,
                {transform: [{scale: pulseAnim}]}
              ]}>
                <TouchableOpacity
                  style={styles.recordButtonInner}
                  onPress={isRecording ? stopRecording : startRecording}>
                  <Icon 
                    name={isRecording ? "stop" : "mic"} 
                    size={32} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.recordingHint}>
                {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
              </Text>
            </View>
          ) : (
            // Playback Interface
            <View style={styles.playbackInterface}>
              <View style={styles.audioInfo}>
                <Icon name="audiotrack" size={24} color="#666" />
                <Text style={styles.audioTitle}>
                  Audio Recording ({formatTime(recordedAudio.duration)})
                </Text>
              </View>

              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={isPlaying ? stopPlayback : playRecording}>
                  <Icon 
                    name={isPlaying ? "pause" : "play-arrow"} 
                    size={28} 
                    color="#2196F3" 
                  />
                </TouchableOpacity>
                
                <View style={styles.timeInfo}>
                  <Text style={styles.timeText}>
                    {isPlaying ? formatTime(playbackTime) : '00:00'} / {formatTime(recordedAudio.duration)}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      {width: `${(playbackTime / recordedAudio.duration) * 100}%`}
                    ]} 
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {recordedAudio && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={deleteRecording}>
              <Icon name="delete" size={20} color="#ff4757" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={confirmRecording}>
              <Icon name="check" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>Use Audio</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recording Instructions */}
        {!recordedAudio && !isRecording && (
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              • Tap the microphone to start recording
            </Text>
            <Text style={styles.instructionText}>
              • Tap stop when you're finished
            </Text>
            <Text style={styles.instructionText}>
              • You can play back and confirm your recording
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 3000,
  },
  backdrop: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    minHeight: 300,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  recordingArea: {
    padding: 20,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  recordingInterface: {
    alignItems: 'center',
  },
  recordingTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ff4757',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingButton: {
    backgroundColor: '#ff6b7a',
  },
  recordButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  recordingHint: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  playbackInterface: {
    width: '100%',
    alignItems: 'center',
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    width: '100%',
  },
  audioTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  progressBarContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  deleteButtonText: {
    marginLeft: 8,
    color: '#ff4757',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  confirmButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '500',
  },
  instructions: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default AudioRecorder;