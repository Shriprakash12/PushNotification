# Expo Push Notification App
Description

This app demonstrates how to implement push notifications using Expo. It allows users to send and receive push notifications even when the app is closed. The app also opens and displays the message on a Notification Screen when a notification is clicked.
# Features

    Send and receive push notifications.
    View the message in the notification screen when opened.
    Notifications work even when the app is closed.

# Requirements

    Node.js (>= 14.x.x)
    Expo CLI
    Android device or emulator for testing push notifications.

# Installation

    Clone the repository:

git clone <GitHub Repo Link>

Navigate to the project folder:

cd <project-directory>

Install dependencies:

npm install

# Start the project:

    expo start

    This will open a new tab in your browser with a QR code that you can scan using the Expo Go app on your Android/iOS device.

# Testing Push Notifications

    Ensure you are using a physical device (push notifications do not work on emulators/simulators).

    Request Permissions: Upon opening the app, the user will be prompted to grant permission for push notifications.

    Sending a Notification:
        Implement a button or other action to send a notification to the device.

    Receiving a Notification:
        Notifications should appear even if the app is closed.
        Upon clicking the notification, the app should open to the Notification Screen displaying the message.

# Generating APK

To export your app as an APK for testing, follow these steps:

    Build the APK: Run the following command in your project directory:

    expo build:android

    Download the APK: Once the build is complete, download the APK from the Expo build page, or use the link provided in the terminal.

    Install the APK on your Android device for testing.

# Demo Video

A demo video will be provided that shows the following:

    Typing and sending a message.
    Receiving a notification while the app is closed.
    Opening the app via the notification and seeing the message displayed on the Notification Screen.



https://github.com/user-attachments/assets/2c38125c-da21-4fd3-8efe-188ef52fa11e

