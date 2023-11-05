import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import logo from "../assets/logo.png";
import LoginModal from "../components/LoginModal";
import * as SecureStore from "expo-secure-store";
import SignUpModal from "../components/SignUpModal";
import { SplashScreen } from "expo-router";

export default function Home() {
  const [loginPressed, setLoginPressed] = useState(false);
  const [signUpPressed, setSignUpPressed] = useState(false);
  const [signOutPressed, setSignOutPressed] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [token, setToken] = useState("");
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [signUpSuccessful, setSignUpSuccessful] = useState(false);
  const [signoutSuccessful, setSignOutSuccessful] = useState(false);

  const loginButtonPress = () => {
    setLoginPressed(true);
    setLoginModalVisible(true);
  };

  const signUpButtonPress = () => {
    setSignUpPressed(true);
    setSignUpModalVisible(true);
  };

  const signOutButtonPress = () => {
    setSignOutPressed(true);
    signout(token);
  };

  const signout = async (userToken) => {
    const logoutUrl = "http://192.168.86.105:8000/users/signout";
    const fetchConfig = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authentication: token,
      },
    };
    const response = await fetch(logoutUrl, fetchConfig);
    if (response.ok) {
      console.log(await response.json());
      setToken("");
      setSignOutSuccessful(true);
      SecureStore.deleteItemAsync("token");
    } else {
      SecureStore.deleteItemAsync("token");
      console.log("Signout failed");
    }
  };

  async function fetchToken(key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        console.log("Successfully retrieved token from store", typeof result);
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

  useEffect(() => {
    console.log("TOKEN =>", token);
  }, [token]);

    return (
      <>
          <View style={styles.homeContainer}>
            <LoginModal
              setLoginModalVisible={setLoginModalVisible}
              loginModalVisible={loginModalVisible}
              setLoginSuccessful={setLoginSuccessful}
            />
          </View>
          <View style={styles.homeContainer}>
            <SignUpModal
              setSignUpModalVisible={setSignUpModalVisible}
              signUpModalVisible={signUpModalVisible}
              setSignUpSuccessful={setSignUpSuccessful}
            />
          </View>
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Caffreedom</Text>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={logo} />
            </View>
            {!token ? (
              <View style={styles.userContainer}>
                <Pressable
                  onPressIn={() => loginButtonPress()}
                  onPressOut={() => setLoginPressed(false)}
                >
                  <Text
                    style={
                      loginPressed ? styles.pressedText : styles.unpressedText
                    }
                  >
                    Log In
                  </Text>
                </Pressable>
                <Pressable
                  onPressIn={() => signUpButtonPress()}
                  onPressOut={() => setSignUpPressed(false)}
                >
                  <Text
                    style={
                      signUpPressed ? styles.pressedText : styles.unpressedText
                    }
                  >
                    Sign-up
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.userContainer}>
                <Pressable
                  onPressIn={() => signOutButtonPress()}
                  onPressOut={() => setSignOutPressed(false)}
                >
                  <Text
                    style={
                      signOutPressed ? styles.pressedText : styles.unpressedText
                    }
                  >
                    Log out
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
          </>
    );
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
    borderRadius: 4,
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
    paddingBottom: 20,
  },
  logo: {
    width: 62,
    height: 62,
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
