import React from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";

import { Link } from "expo-router";

export default function Footer() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <View style={styles.footerContainer}>
        <Link style={styles.footerText} href="/home">Home</Link>
        <Link style={styles.footerText} href="/calculator">Calculator</Link>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    bottom: 0,
    position: "fixed",
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row"
  },
  footerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 18,
  }
});
