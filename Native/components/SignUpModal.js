import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Modal, TextInput } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function SignUpModal({ signUpModalVisible, setSignUpModalVisible, setSignUpSuccessful }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  const handleSubmit = async (e) => {
    const data = {};
    data.username = username;
    data.password = password;
    data.password_confirmation = confirmPassword;
    console.log(data);
    const signUpUrl = `${apiUrl}/users/signup/`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(signUpUrl, fetchConfig);
    console.log("RESPONSE:", response);
    if (response.ok) {
      const tokenInfo = await response.json();
      const token = tokenInfo.token;
      console.log("ERROR MESSAGE", tokenInfo);
      save("token", token);
      setUsername("");
      setPassword("");
      setSignUpModalVisible(false);
      setSignUpSuccessful(true);
    } else {
      const errorMessage = await response.json();
      console.log(errorMessage);
      setError(errorMessage["error"]);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleClose = () => {
    setSignUpModalVisible(!signUpModalVisible);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
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
            <TextInput style={styles.input} onChangeText={setUsername} placeholder="Username" value={username}></TextInput>
            {error ? (
              <View
                styles={{
                  borderWidth: 10,
                  borderColor: "orange",
                  borderStyle: "solid",
                }}
              >
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <TextInput style={styles.input} onChangeText={setPassword} placeholder="Password" value={password} secureTextEntry={true}></TextInput>
            <TextInput style={styles.input} onChangeText={setConfirmPassword} placeholder="Confirm Password" value={confirmPassword} secureTextEntry={true}></TextInput>
            <Pressable style={[styles.button]} onPress={() => handleSubmit()}>
              <Text style={styles.submitStyle}>Submit</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={handleClose}>
              <Text style={styles.closeStyle}>Close</Text>
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
    width: "80%",
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
  closeStyle: {
    color: "rgba(94, 25, 121, 1)",
    textAlign: "center",
    fontFamily: "Lora_400Regular_Italic",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Lora_400Regular_Italic",
  },
  errorText: {
    color: "rgba(242, 255, 99, 1)",
    textDecorationLine: "underline",
    fontFamily: "Lora_400Regular_Italic",
    textAlign: "center",
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
    width: "75%",
    padding: 10,
    margin: 10,
  },
});
