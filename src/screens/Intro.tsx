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
      <Text style={styles.footer}>© {new Date().getFullYear()} DefectTracker Pro</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D6A4F', // Light Gray
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    backgroundColor: '#ffffff', 
    borderRadius: 48,
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoImage: {
    width: 72,
    height: 72,
    tintColor: '#2D6A4F',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff', // Navy Blue
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff', // Teal
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
    elevation: 3,
    borderColor: '#ffffff',
    borderWidth: 2,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    color: '#ffffffff', // Medium Gray
    fontSize: 13,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default IntroScreen;
