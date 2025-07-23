import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

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
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Icon name="bug-outline" size={32} color="#1976d2" />
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
              />
              <TouchableOpacity
                style={styles.eyeIconAbsolute}
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#888"
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
                    color={rememberMe ? '#4cafaf' : '#bdbdbd'}
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

            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Username: admin</Text>
              <Text style={styles.demoText}>Password: admin</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3fd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  iconCircle: {
    backgroundColor: '#e6f0ff',
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#000000ff',
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000ff',
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
    borderColor: '#000000ff',
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
    color: '#444',
  },
  forgotText: {
    color: '#1976d2',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoBox: {
    backgroundColor: '#f1f8ff',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  demoTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  demoText: {
    fontSize: 13,
    color: '#333',
  },
});

export default LoginScreen;
