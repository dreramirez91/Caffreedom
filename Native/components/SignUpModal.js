import { SplashScreen } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";

SplashScreen.hideAsync();

export default function SignUpModal({
  signUpModalVisible,
  setSignUpModalVisible,
  setSignUpSuccessful,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  const handleSubmit = async (e) => {
    if (password === confirmPassword) {
      const data = {};
      data.username = username;
      data.password = password;
      console.log(data);
      const signUpUrl = "http://192.168.86.105:8000/users/signup";
      const fetchConfig = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(signUpUrl, fetchConfig);
      if (response.ok) {
        const tokenInfo = await response.json();
        const token = tokenInfo.token;
        console.log(token);
        save("token", token);
        setUsername("");
        setPassword("");
        setSignUpModalVisible(false);
        setSignUpSuccessful(true);
      } else {
        console.log("Sign up failed");
      }
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signUpModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSignUpModalVisible(!signUpModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sign Up</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              placeholder="Username"
              value={username}
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              placeholder="Password"
              value={password}
              secureTextEntry={true}
            ></TextInput>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry={true}
            ></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.submitStyle}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setSignUpModalVisible(!signUpModalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(157, 108, 255, 1)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  submitButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "rgba(157, 108, 255, 1)",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Lora_400Regular_Italic",
  },
  submitStyle: {
    color: "rgba(242, 255, 99, 1)",

    textAlign: "center",
    fontFamily: "Lora_400Regular_Italic",
  },
  modalText: {
    color: "rgba(242, 255, 99, 1)",
    marginBottom: 15,

    fontFamily: "Lora_400Regular_Italic",
    textAlign: "center",
  },
  input: {
    color: "black",
    fontFamily: "Lora_400Regular_Italic",
    borderRadius: 8,
    borderColor: "rgba(242, 255, 99, 1)",
    backgroundColor: "white",
    borderWidth: 1,
    width: 150,
    padding: 10,
    margin: 10,
  },
});
