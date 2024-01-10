import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";
import { TextInput } from "react-native-gesture-handler";
import { caffeineContent } from "../caffeineContent";
import { Divider } from "react-native-paper";
import { LogBox } from "react-native";

export default function CaffeineTable() {
  const apiUrl = "http://192.168.86.102:8000";
  const [caffeine, setCaffeine] = useState(0);
  const [intakes, setIntakes] = useState([0]);
  const tableHead = ["Drink", "Amount\n(Tap to edit)", "Caffeine content", "Date", "Delete"];
  const [tableData, setTableData] = useState([]);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [editSuccessful, setEditSuccessful] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [newAmount, setNewAmount] = useState("0");
  const patchAmount = useRef();
  patchAmount.current = newAmount;
  const patchCaffeine = useRef();
  patchCaffeine.current = caffeine;

  const twoOptionDeleteHandler = (intake, token) => {
    Alert.alert(
      "Delete",
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
    );
  };

  const twoOptionEditHandler = (intake, token, measurement, drink) => {
    Alert.alert(
      "Edit",
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
            Authorization: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(`${apiUrl}/caffeine/delete/`, fetchConfig);
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
        const fetchConfig = {
          method: "patch",
          headers: {
            "Content-type": "application/json",
            Authorization: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(`${apiUrl}/caffeine/edit/`, fetchConfig);
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
        console.log("Successfully retrieved token from store");
        const fetchConfig = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: result,
          },
        };
        const response = await fetch(`${apiUrl}/caffeine/list_caffeine/`, fetchConfig);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetch successful");
          setIntakes(data.intakes);
          const tableDataToSet = [];
          for (let intake of data.intakes) {
            const tableRow = [];
            tableRow.push(
              intake.type,
              <View style={styles.amountStyle}>
                <TextInput returnKeyType={"done"} maxLength={7} selectTextOnFocus={true} onChangeText={setNewAmount} keyboardType="numeric" onSubmitEditing={() => twoOptionEditHandler(intake.id, "token", intake.measurement, intake.type)} placeholder={`${intake.amount}`} placeholderTextColor={"rgba(242, 255, 99, 1)"} style={styles.editText}></TextInput>
                <Text style={styles.tableText}> {`${intake.amount === 1 ? intake.measurement.slice(0, intake.measurement.length - 1) : intake.measurement}`}</Text>
              </View>,
              `${intake.caffeine} mg`,
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
        <Text style={styles.headerText}>Your Caffeine Intake</Text>
        <Divider style={{ margin: 12 }} bold="true" horizontalInset="true" />
        <Text style={styles.bodyText}>Login or make an account to track your caffeine intake.</Text>
      </View>
    );
  } else if (intakes.length === 0) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <Divider style={{ margin: 12 }} bold="true" horizontalInset="true" />
        <Text style={styles.bodyText}>Add caffeine intakes using the calculator to have them display in the table and graph.</Text>
      </View>
    );
  } else if (tableData.length === 0) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Table
          borderStyle={{
            borderWidth: 2,
            borderColor: "gray",
          }}
        >
          <Row data={tableHead} style={{ height: 40, backgroundColor: "#f1f8ff" }} textStyle={{ textAlign: "center", fontWeight: "bold", fontFamily: "CrimsonPro_400Regular" }} />
        </Table>
        <ActivityIndicator animating={true} color={"rgba(242, 255, 99, 1)"} size={"large"} style={{ padding: 50 }} />
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Table
          borderStyle={{
            borderWidth: 2,
            borderColor: "gray",
          }}
        >
          <Row data={tableHead} style={{ height: 40, backgroundColor: "#f1f8ff" }} textStyle={{ textAlign: "center", fontWeight: "bold", fontFamily: "CrimsonPro_400Regular" }} />
          <Rows
            data={tableData}
            style={{ height: 80 }}
            textStyle={{
              textAlign: "center",
              color: "rgba(242, 255, 99, 1)",
              fontFamily: "CrimsonPro_400Regular",
              fontSize: 14,
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
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 30,
    textAlign: "center",
  },
  bodyText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  tableText: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
    textAlignVertical: "center",
  },
  editText: {
    textAlign: "center",
    color: "rgba(94, 25, 121, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
  },
  deleteText: {
    textAlign: "center",
    color: "rgba(255, 99, 99, 1)",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
  },
});
