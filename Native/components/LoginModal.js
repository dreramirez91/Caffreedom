import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Modal, TextInput } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Button } from "react-native-paper";

export default function LoginModal({ loginModalVisible, setLoginModalVisible, setLoginSuccessful }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  const handleClose = () => {
    setLoginModalVisible(!loginModalVisible);
    setUsername("");
    setPassword("");
    setError("");
  };
  const handleSubmit = async (e) => {
    const data = {};
    data.username = username.toLowerCase();
    data.password = password;
    const loginUrl = `${apiUrl}/users/signin/`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(loginUrl, fetchConfig);
    if (response.ok) {
      setError("");
      const tokenInfo = await response.json();
      const token = tokenInfo.token;
      save("token", token);
      setUsername("");
      setPassword("");
      setLoginModalVisible(false);
      setLoginSuccessful(true);
    } else {
      const errorMessage = await response.json();
      setError(errorMessage["error"]);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setLoginModalVisible(!loginModalVisible);
          setError("");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Login</Text>
            <View style={styles.inputs}>
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
            </View>
            <View style={styles.buttons}>
              <Button onPress={() => handleSubmit()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                Log In
              </Button>
              <Button onPress={handleClose} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                Close
              </Button>
            </View>
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
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeStyle: {
    color: "rgba(94, 25, 121, 1)",
    textAlign: "center",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 18,
  },
  submitStyle: {
    color: "rgba(242, 255, 99, 1)",
    textAlign: "center",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 18,
  },
  modalText: {
    color: "rgba(242, 255, 99, 1)",
    marginBottom: 15,
    fontFamily: "CrimsonPro_400Regular",
    textAlign: "center",
    fontSize: 22,
  },
  errorText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    color: "black",
    fontFamily: "CrimsonPro_400Regular",
    borderRadius: 8,
    borderColor: "rgba(242, 255, 99, 1)",
    backgroundColor: "white",
    borderWidth: 1,
    width: "75%",
    padding: 10,
    margin: 10,
    fontSize: 18,
  },
  inputs: {
    alignItems: "center",
  },
  buttons: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
