import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './ThemeContext';
import { createTables } from './database';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import UserListScreen from './UserListScreen';
import ChatScreen from './ChatScreen';
import FeedScreen from './FeedScreen';
import InfoScreen from './InfoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="UserList" component={UserListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}   