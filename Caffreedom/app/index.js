// export default function Page() {
//   return <View><Link href="/home">Home</Link></View>;
// }
import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  Button
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import logo from "../assets/logo.png";
import { Link } from "expo-router";

export default function Home() {
  const [loginPressed, setLoginPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const Separator = () => <View style={styles.separator} />;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <View style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Caffreedom</Text>
          </View>
          <View style={styles.logoContainer}><Image style={styles.logo} source={logo} /></View>
          <View style={styles.userContainer}>
            <Pressable onPressIn={() => setLoginPressed(true)} onPressOut={() => setLoginPressed(false)}>
              <Text style={loginPressed? styles.pressedText : styles.unpressedText}>Login</Text>
            </Pressable>
            <Pressable onPressIn={() => setSignUpPressed(true)} onPressOut={() => setSignUpPressed(false)}>
              <Text style={signUpPressed? styles.pressedText : styles.unpressedText}>Sign-up</Text>
            </Pressable>
          </View>
        </ImageBackground>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    width: "80%",
    justifyContent: "center",
    paddingTop: 10,
    flexDirection: "row",
    borderRadius: 4
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 24,
    textAlign: "center",
  },
  logoContainer: {
    width: "80%",
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20
  },
  logo: {
    width: 55,
    height: 55,
  },
  userContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-evenly",
    paddingBottom: 10,
    borderRadius: 4
  },
  unpressedText: {
    color: "rgba(94, 25, 121, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline"
  },
  pressedText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
});
