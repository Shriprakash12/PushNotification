 // Import necessary libraries and components
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import * as Device from 'expo-device'; // To check device type (physical or simulator)
import * as Notifications from 'expo-notifications'; // To handle push notifications
import Constants from 'expo-constants'; // To access project-specific configuration
import { createStackNavigator } from '@react-navigation/stack'; // For navigation between screens

// Create a Stack navigator for navigation between screens
const Stack = createStackNavigator();

// Set default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show an alert when the notification is received
    shouldPlaySound: false, // Disable sound for notifications
    shouldSetBadge: false, // Disable badge updates
  }),
});

// Function to handle registration errors
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage); // Display an error alert
  throw new Error(errorMessage); // Throw an error for debugging
}

// Function to register the device for push notifications
async function registerForPushNotificationsAsync() {
  // Configure notification settings for Android devices
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX, // High importance for notifications
      vibrationPattern: [0, 250, 250, 250], // Vibration pattern
      lightColor: '#FF231F7C', // Notification light color
    });
  }

  // Check if the app is running on a physical device
  if (Device.isDevice) {
    // Check and request notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    // Get the project ID from Expo configuration
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    // Retrieve the push notification token
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    // Error if running on a simulator
    handleRegistrationError('Must use physical device for push notifications');
  }
}

// Home screen component
function HomeScreen({ navigation }: { navigation: any }) {
  // Define state variables
  const [expoPushToken, setExpoPushToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState('');
  const [isNotificationSent, setIsNotificationSent] = useState(false); // Prevent multiple sends
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  // Define notification listeners
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Register for notifications and set up listeners
  useEffect(() => {
    // Get push notification token
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    // Listener for receiving notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification); // Update state with the received notification
    });

    // Listener for handling notification responses
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Navigate to the NotificationScreen with notification details
      navigation.navigate('NotificationScreen', {
        title: response.notification.request.content.title,
        body: response.notification.request.content.body,
        data: response.notification.request.content.data,
      });
    });

    // Cleanup listeners on component unmount
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Reset input fields and notification state
  const reset = () => {
    setTitle('');
    setBody('');
    setData('');
    setIsNotificationSent(false);
  };

  // Function to schedule a push notification
  async function schedulePushNotification() {
    if (isNotificationSent) {
      alert('Notification already sent!'); // Prevent duplicate notifications
      return;
    }

    try {
      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title, // Notification title
          body: body, // Notification body
          data: { data }, // Additional data
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5, // Trigger after 10 seconds
        },
      });

      setIsNotificationSent(true); // Mark notification as sent
      reset(); // Reset input fields
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Render the UI for the HomeScreen
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        {/* Input for notification title */}
        <TextInput
          placeholder="Enter the Title"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={title}
          onChangeText={txt => setTitle(txt)}
        />
        {/* Input for notification body */}
        <TextInput
          placeholder="Enter the Body"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={body}
          onChangeText={txt => setBody(txt)}
        />
        {/* Input for notification data */}
        <TextInput
          placeholder="Enter The Data"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={data}
          onChangeText={txt => setData(txt)}
        />
      </View>
      {/* Button to send notification */}
      <TouchableOpacity
        onPress={async () => await schedulePushNotification()}
        style={{
          borderWidth: 2,
          backgroundColor: '#9694FF',
          width: '90%',
          height: 55,
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: 40,
          borderRadius: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

// Component to display notification details
function DisplayMessageScreen({ route, navigation }: { route: any; navigation: any }) {
  const { title, body, data } = route.params; // Extract notification details

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Notification Details:</Text>
      <Text style={{ fontSize: 18 }}>Title: {title}</Text>
      <Text style={{ fontSize: 18 }}>Body: {body}</Text>
      <Text style={{ fontSize: 18 }}>Data: {JSON.stringify(data)}</Text>
      {/* Button to go back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          borderWidth: 2,
          backgroundColor: '#9694FF',
          width: '90%',
          height: 55,
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: 40,
          borderRadius: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main app component
export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NotificationScreen" component={DisplayMessageScreen} />
    </Stack.Navigator>
  );
}
