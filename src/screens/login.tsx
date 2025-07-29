import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load saved credentials
  useEffect(() => {
    const loadCredentials = async () => {
      const saved = await AsyncStorage.getItem('credentials');
      if (saved) {
        const { username, password } = JSON.parse(saved);
        setUsername(username);
        setPassword(password);
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    if (username === 'admin' && password === 'admin') {
      if (rememberMe) {
        await AsyncStorage.setItem(
          'credentials',
          JSON.stringify({ username, password })
        );
      } else {
        await AsyncStorage.removeItem('credentials');
      }
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Please contact your administrator.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.replace('Intro')}
            style={styles.iconButton}
            accessibilityLabel="Back"
          >
            <Icon name="arrow-left" size={22} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Image
                source={require('../../assets/bug.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>DefectTracker Pro</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              accessibilityLabel="Username input"
              placeholderTextColor="#3d4642ff"
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                accessibilityLabel="Password input"
                placeholderTextColor="#3d4642ff"
              />
              <TouchableOpacity
                style={styles.eyeIconAbsolute}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#2D6A4F"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.rememberMe}>
                <TouchableOpacity
                  style={styles.checkboxTouchable}
                  onPress={() => setRememberMe((prev) => !prev)}
                  accessibilityLabel="Remember Me"
                  activeOpacity={0.7}
                >
                  <Icon
                    name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color={rememberMe ? '#ffffffff' : '#ffffff'}
                  />
                </TouchableOpacity>
                <Text style={styles.rememberMeText}>Remember Me</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    top: 32,
    left: 18,
    zIndex: 10,
    padding: 6,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.08)', // transparent white
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    // elevation: 4,
    // Optional: add border and shadow for better visibility
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    // backdropFilter is not supported in React Native, so ignore blur
  },
  iconCircle: {
    backgroundColor: '#ffffff',
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoImage: {
    width: 40,
    height: 40,
    tintColor: '#2D6A4F',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 18,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  passwordInputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 8,
  },
  inputWithIcon: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    paddingRight: 40, // space for the icon
    backgroundColor: '#f8fafc',
    color: '#000000ff',
  },
  eyeIconAbsolute: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxTouchable: {
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#ffffff',
  },
  forgotText: {
    color: '#ffffff',
    fontSize: 13,
    textDecorationLine:'underline',
  },
  button: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#ffffff',
    
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
