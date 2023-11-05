// This file is used to add providers, such as Redux, into the app, which can be accessed by any route in the app.
// Compare App.js in traditional React Native projects

import { Slot, SplashScreen } from 'expo-router';
import Footer from '../components/Footer'
import background from "../assets/background.jpeg";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ImageBackground, StyleSheet } from 'react-native';
// import * as operatingSystem from 'os';

SplashScreen.preventAutoHideAsync();

export default function appLayout() {
    // Attempting to get local IP but os is not found even though it's found in the import above...
    // const networkInterfaces = operatingSystem.networkInterfaces();
    // const ip = networkInterfaces['eth0'][0]['address']
    // console.log(networkInterfaces);
    return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
        <Slot/>
        </ImageBackground>
        <Footer/>
        <StatusBar style="auto" />
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }
  });
