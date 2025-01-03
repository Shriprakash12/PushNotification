import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function NotificationScreen({ route, navigation }: { route: any; navigation: any }) {
   // Extract notification details from the route params
  const { title, body, data } = route.params;
  
  return (
    // Main container view with center alignment for the content
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Notification Details:</Text>
       {/* Header text showing notification title */}
      <Text style={{ fontSize: 18 }}>Title: {title}</Text>
       {/* Display notification title */}
      <Text style={{ fontSize: 18 }}>Body: {body}</Text>
       {/* Display notification body */}
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
