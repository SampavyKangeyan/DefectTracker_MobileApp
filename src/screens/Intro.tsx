import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const IntroScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Image
          source={require('../../assets/bug.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>DefectTracker Pro</Text>
      <Text style={styles.subtitle}>
        Welcome to your trusted platform for defect management and project health.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Login')}
        accessibilityLabel="Get Started"
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>© 2024 DefectTracker Pro</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light Gray
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    backgroundColor: '#aac1ffff', 
    borderRadius: 48,
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A', // Navy Blue
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#2D6A4F', // Teal
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2D6A4F', // Teal
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 24,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    color: '#9CA3AF', // Medium Gray
    fontSize: 13,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default IntroScreen;
