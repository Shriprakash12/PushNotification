import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import * as Device from 'expo-device'; // Import expo-device for device-related info
import * as Notifications from 'expo-notifications'; // Import expo-notifications for handling notifications
import Constants from 'expo-constants'; // Import expo-constants for app constants
import { registerForPushNotificationsAsync } from '../utils/notificationUtils'; // Import custom utility for push notifications

export default function HomeScreen({ navigation }: { navigation: any }) {
  // State variables to hold user input and notification details
  const [expoPushToken, setExpoPushToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState('');
  const [isNotificationSent, setIsNotificationSent] = useState(false);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  // Refs for listeners
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // For Android, set up a notification channel with specific properties (e.g., importance, vibration)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250], // Vibration pattern
        lightColor: '#FF231F7C', // Notification light color
      });
    }

    // Register for push notifications and save the token
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    // Add listener to handle incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification); // Save the received notification
    });

    // Add listener to handle user interaction with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
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
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Reset function to clear input fields and notification status
  const reset = () => {
    setTitle('');
    setBody('');
    setData('');
    setIsNotificationSent(false);
  };

  // Function to schedule a push notification
  async function schedulePushNotification() {
    console.log(title + body + data); // Logs the notification data

    // Check if notification has already been sent
    if (isNotificationSent) {
      alert('Notification already sent!');
      return;
    }

    try {
      // Cancel any scheduled notifications before scheduling a new one
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a new notification to trigger after 5 seconds
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title, // Notification title
          body: body, // Notification body
          data: { data }, // Additional data
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5, // Trigger after 5 seconds
        },
      });

      // Mark the notification as sent
      setIsNotificationSent(true);

      // Reset the input fields
      reset();
    } catch (error) {
      console.error('Error scheduling notification:', error); // Log any errors
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center' }}>
        {/* Title input field */}
        <TextInput
          placeholder="Enter the Title"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={title}
          onChangeText={txt => setTitle(txt)} // Updates title state
        />
        {/* Body input field */}
        <TextInput
          placeholder="Enter the Body"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={body}
          onChangeText={txt => setBody(txt)} // Updates body state
        />
        {/* Data input field */}
        <TextInput
          placeholder="Enter The Data"
          style={{ width: '80%', height: 50, borderWidth: 1, margin: 10, borderRadius: 10 }}
          value={data}
          onChangeText={txt => setData(txt)} // Updates data state
        />
      </View>

      {/* Send Notification Button */}
      <TouchableOpacity
        onPress={async () => await schedulePushNotification()} // Calls function to send notification
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
