import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Pressable,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import logo from "../assets/logo.png";
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [loginPressed, setLoginPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const Separator = () => <View style={styles.separator} />;

  const loginButtonPress = () => {
    setLoginPressed(true);
    setModalVisible(true);
  }

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
           <View style={styles.homeContainer}>
             <LoginModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
             </View>
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Caffreedom</Text>
          <View style={styles.logoContainer}><Image style={styles.logo} source={logo} /></View>
          <View style={styles.userContainer}>
                
            <Pressable onPressIn={() => loginButtonPress()} onPressOut={() => setLoginPressed(false)}>
              <Text style={loginPressed? styles.pressedText : styles.unpressedText}>Login</Text>
            </Pressable>
            <Pressable onPressIn={() => setSignUpPressed(true)} onPressOut={() => setSignUpPressed(false)}>
              <Text style={signUpPressed? styles.pressedText : styles.unpressedText}>Sign-up</Text>
            </Pressable>
          </View>
          </View>
        </ImageBackground>
        <StatusBar style="auto" />
        <Footer />
      </SafeAreaView>
    );
  } else {
    SplashScreen.show;
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
    paddingTop: 5,
    borderRadius: 4
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 26,
    textAlign: "center",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20
  },
  logo: {
    width: 62,
    height: 62,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 10,
    alignContent: "center"
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
});
