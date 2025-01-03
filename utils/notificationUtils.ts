import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Function to register the device for push notifications
export async function registerForPushNotificationsAsync() {
  // Check if the app is running on a physical device
  if (Device.isDevice) {
    
    // Get the current notification permissions status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If the permission is not granted, request permission from the user
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission is still not granted, throw an error
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted to get push token for push notification!');
    }

    // Get the project ID from the app's configuration
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    
    // If project ID is not found, throw an error
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    try {
      // Get the Expo push token for the device using the project ID
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      return pushTokenString;  // Return the push token
    } catch (e: any) {
      // If any error occurs while fetching the push token, throw the error
      throw new Error(`${e}`);
    }

  } else {
    // If the app is not running on a physical device, throw an error
    throw new Error('Must use physical device for push notifications');
  }
}
