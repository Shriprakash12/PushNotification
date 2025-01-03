import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '@/screens/NotificationScreen';

// Create a Stack navigator for navigation between screens
const Stack = createStackNavigator();

// Set default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // Show an alert when the notification is received
    shouldPlaySound: false, // Disable sound for notifications
    shouldSetBadge: false,  // Disable badge updates
  }),
});

// Function to handle registration errors
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage); // Display an error alert
  throw new Error(errorMessage); // Throw an error for debugging
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
