import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import IntroScreen from './src/screens/Intro';
import LoginScreen from './src/screens/login';
import DashboardScreen from './src/screens/dashboard';
import Project from './src/screens/project';
import DefectSeverityBreakdown from './src/screens/DefectSeverityBreakdown';

// Define the navigation parameter types
export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Dashboard: undefined;
  ProjectDetails: {
    id: string;
    name: string;
    severity: string;
  };
  DefectSeverityBreakdown: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ProjectDetails" component={Project} />
          <Stack.Screen name="DefectSeverityBreakdown" component={DefectSeverityBreakdown} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});

export default App;
