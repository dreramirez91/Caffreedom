import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import logo from "../assets/logo.png";
import LoginModal from "../components/LoginModal";
import * as SecureStore from "expo-secure-store";
import SignUpModal from "../components/SignUpModal";
import { Button } from "react-native-paper";

export default function Home() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [token, setToken] = useState("");
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [signUpSuccessful, setSignUpSuccessful] = useState(false);
  const [signoutSuccessful, setSignOutSuccessful] = useState(false);

  const loginButtonPress = () => {
    setLoginModalVisible(true);
    setLoginSuccessful(false);
  };

  const signUpButtonPress = () => {
    setSignUpModalVisible(true);
    setSignUpSuccessful(false);
  };

  const signOutButtonPress = () => {
    signout();
  };

  const signout = async () => {
    const logoutUrl = `${apiUrl}/users/signout/`;
    const fetchConfig = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Referer: `${apiUrl}/`,
      },
    };
    const response = await fetch(logoutUrl, fetchConfig);
    if (response.ok) {
      setToken("");
      setSignOutSuccessful(true);
      SecureStore.deleteItemAsync("token");
    } else {
      console.log("Signout failed");
    }
  };

  async function fetchToken(key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        setToken(result);
      } else {
        console.log("Could not retrieve token from store");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchToken("token");
  }, [loginSuccessful, signUpSuccessful, signoutSuccessful]);

  return (
    <>
      <View style={styles.homeContainer}>
        <LoginModal setLoginModalVisible={setLoginModalVisible} loginModalVisible={loginModalVisible} setLoginSuccessful={setLoginSuccessful} />
      </View>
      <View style={styles.homeContainer}>
        <SignUpModal setSignUpModalVisible={setSignUpModalVisible} signUpModalVisible={signUpModalVisible} setSignUpSuccessful={setSignUpSuccessful} />
      </View>
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Caffreedom</Text>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} />
        </View>
        {!token ? (
          <View style={styles.userContainer}>
            <Button onPressIn={() => loginButtonPress()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
              Log In
            </Button>
            <Button onPressIn={() => signUpButtonPress()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
              Sign-up
            </Button>
          </View>
        ) : (
          <View style={styles.userContainer}>
            <Button onPressIn={() => signOutButtonPress()} mode="contained" buttonColor="rgba(94, 65, 153, 1)" icon="door" contentStyle={{ flexDirection: "row-reverse" }}>
              Sign out
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.78)",
    width: "100%",
    justifyContent: "center",
    paddingTop: 5,
    borderRadius: 4,
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 32,
    textAlign: "center",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 10,
    alignContent: "center",
  },
  unpressedText: {
    color: "rgba(94, 25, 121, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  pressedText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline",
  },
});
