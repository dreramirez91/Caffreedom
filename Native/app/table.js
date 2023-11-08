import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";
import { LogBox } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { caffeineContent } from "../caffeineContent";

// LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell', "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first."]);

export default function CaffeineTable() {
  const [caffeine, setCaffeine] = useState(0);
  const [intakes, setIntakes] = useState([0]);
  const tableHead = ["Drink", "Amount", "Caffeine content", "Date", ""];
  const [tableData, setTableData] = useState([]);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [editSuccessful, setEditSuccessful] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [newAmount, setNewAmount] = useState("0");
  const [editSelected, setEditSelected] = useState(false);
  const patchAmount = useRef();
  patchAmount.current = newAmount;
  const patchCaffeine = useRef();
  patchCaffeine.current = caffeine;
  const refEditSelected = useRef();
  refEditSelected.current = editSelected;

  const twoOptionDeleteHandler = (intake, token) => {
    console.log("INTAKE TO BE DELETED =>", intake);
    //function to make two option alert
    Alert.alert(
      //title
      "Delete",
      //body
      "Are you sure?",
      [
        { text: "Yes", onPress: () => deleteIntake(intake, token) },
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  const twoOptionEditHandler = (intake, token, measurement, drink) => {
    //function to make two option alert
    Alert.alert(
      //title
      "Edit",
      //body
      "Are you sure?",
      [
        {
          text: "Yes",
          onPress: () => editIntake(intake, token, measurement, drink),
        },
        {
          text: "No",
          onPress: () => setNewAmount("0"),
          style: "cancel",
        },
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    );
  };

  async function deleteIntake(id, key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const data = {};
        data.id = id;
        const fetchConfig = {
          method: "delete",
          headers: {
            "Content-type": "application/json",
            Authentication: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(
          "http://192.168.86.105:8000/users/delete",
          fetchConfig
        );
        if (response.ok) {
          const data = await response.json();
          setDeleteSuccessful(true);
        } else {
          console.log("Delete failed");
        }
      } else {
        console.log("Could not retrieve token from store for delete request");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(newAmount);
  }, [newAmount]);

  async function editIntake(id, key, measurement, beverage) {
    for (let drink of caffeineContent) {
      if (drink["title"] == beverage) {
        if (measurement === "floz") {
          setCaffeine(drink["mg/floz"] * patchAmount.current);
        } else if (measurement === "cups") {
          setCaffeine(drink["mg/floz"] * patchAmount.current * 8);
        } else if (measurement === "ml") {
          setCaffeine((drink["mg/floz"] * patchAmount.current) / 29.5735);
        }
      }
    }
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const data = {};
        data.id = id;
        data.amount = patchAmount.current;
        data.caffeine = patchCaffeine.current;
        console.log("DATA TO BE SENT IN EDIT REQUEST", data);
        const fetchConfig = {
          method: "patch",
          headers: {
            "Content-type": "application/json",
            Authentication: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(
          "http://192.168.86.105:8000/users/edit",
          fetchConfig
        );
        if (response.ok) {
          const data = await response.json();
          setEditSuccessful(true);
        } else {
          console.log("Edit failed");
        }
      } else {
        console.log("Could not retrieve token from store for delete request");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function populateData(key) {
    try {
      setDeleteSuccessful(false);
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        console.log("Successfully retrieved token from store", result);
        const fetchConfig = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authentication: result,
          },
        };
        const response = await fetch(
          "http://192.168.86.105:8000/users/list_caffeine",
          fetchConfig
        );
        if (response.ok) {
          console.log("Token in fetch", result);
          const data = await response.json();
          console.log("Fetch successful");
          setIntakes(data.intakes);
          const tableDataToSet = [];
          for (let intake of data.intakes) {
            console.log(intake);
            const tableRow = [];
            tableRow.push(
              intake.type,
              <View style={styles.amountStyle}>
                <TextInput
                  returnKeyType={"done"}
                  maxLength={7}
                  selectTextOnFocus={true}
                  onChangeText={setNewAmount}
                  keyboardType="numeric"
                  onFocus={setEditSelected(true)}
                  onBlur={setEditSelected(false)}
                  onSubmitEditing={() =>
                    twoOptionEditHandler(
                      intake.id,
                      "token",
                      intake.measurement,
                      intake.type
                    )
                  }
                  placeholder={`${intake.amount}`}
                  placeholderTextColor={"rgba(242, 255, 99, 1)"}
                  style={styles.editText}
                ></TextInput>
                <Text style={styles.tableText}>
                  {" "}
                  {`${
                    intake.amount === 1
                      ? intake.measurement.slice(
                          0,
                          intake.measurement.length - 1
                        )
                      : intake.measurement
                  }`}
                </Text>
              </View>,
              intake.caffeine,
              intake.date,
              <Pressable
                onPress={() => {
                  twoOptionDeleteHandler(intake.id, "token");
                }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            );
            tableDataToSet.push(tableRow);
          }
          setTableData(tableDataToSet);
          setUserLoggedIn(true);
        } else {
          console.error("Fetch failed");
        }
      } else {
        setUserLoggedIn(false);
        console.log("Could not retrieve token from store");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    populateData("token");
  }, [deleteSuccessful, editSuccessful]);

  if (!userLoggedIn) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <Text style={styles.bodyText}>
          Login or make an account to track your caffeine intake.
        </Text>
      </View>
    );
  } else if (intakes.length === 0) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <Table borderStyle={{ borderWidth: 2, borderColor: "gray" }}>
          <Row
            data={tableHead}
            style={{ height: 40, backgroundColor: "#f1f8ff" }}
            textStyle={{ textAlign: "center", fontWeight: "bold" }}
          />
          <Rows
            data={tableData}
            style={{ height: 80 }}
            textStyle={{ textAlign: "center" }}
          />
        </Table>
      </View>
    );
  } else {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>

        <Table
          borderStyle={{
            borderWidth: 2,
            borderColor: "gray",
          }}
        >
          <Row
            data={tableHead}
            style={{ height: 40, backgroundColor: "#f1f8ff" }}
            textStyle={{ textAlign: "center", fontWeight: "bold" }}
          />
          <Rows
            data={tableData}
            style={{ height: 80 }}
            textStyle={{
              textAlign: "center",
              color: "rgba(242, 255, 99, 1)",
              fontFamily: "Lora_400Regular_Italic",
              fontSize: 12,
            }}
          />
        </Table>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "center",
    padding: 10,
    borderRadius: 4,
    width: "100%",
  },
  amountStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    padding: 10,
    borderRadius: 4,
    width: "100%",
  },
  contentContainerStyle: {
    justifyContent: "center",
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 10,
  },
  bodyText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  tableText: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 12,
  },
  editText: {
    textAlign: "center",
    color: "rgba(94, 25, 121, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 12,
  },
  deleteText: {
    textAlign: "center",
    color: "rgba(255, 99, 99, 1)",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 12,
  },
});
