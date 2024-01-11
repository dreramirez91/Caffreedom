import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";
import { TextInput } from "react-native-gesture-handler";
import { caffeineContent } from "../caffeineContent";
import { Divider, Portal, Modal, Button } from "react-native-paper";
import { LogBox } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CaffeineTable() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [caffeine, setCaffeine] = useState(0);
  const [intakes, setIntakes] = useState([0]);
  const tableHead = ["Drink", "Amount,\nTap to edit", "Caffeine content", "Date", "Notes", "Delete"];
  const [tableData, setTableData] = useState([]);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editSuccessful, setEditSuccessful] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [newAmount, setNewAmount] = useState("0");
  const [edit, setEdit] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [originalNote, setOriginalNote] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const showNotesModal = (note, id) => {
    setCurrentNote(note);
    setOriginalNote(note);
    setCurrentNoteId(id);
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const cancelNotes = () => {
    setEdit(false);
    setCurrentNote(null);
    setCurrentNoteId(null);
    setVisible(false);
  };
  const patchAmount = useRef();
  patchAmount.current = newAmount;
  const patchCaffeine = useRef();
  patchCaffeine.current = caffeine;

  const formatDate = (date) => {
    const dateSplit = date.split("-");
    const year = dateSplit.shift();
    return `${dateSplit[0]}-${dateSplit[1]}-${year.slice(2)}`;
  };

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

  async function editNote(id, key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const data = {};
        data.id = id;
        data.notes = currentNote;
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
          console.log(data);
          setOriginalNote("");
          setEdit(false);
          populateData("token");
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
            const date = formatDate(intake.date);
            console.log(date);
            tableRow.push(
              intake.type,
              <View style={styles.amountStyle}>
                <TextInput returnKeyType={"done"} maxLength={7} selectTextOnFocus={true} onChangeText={setNewAmount} keyboardType="numeric" onSubmitEditing={() => twoOptionEditHandler(intake.id, "token", intake.measurement, intake.type)} placeholder={`${intake.amount}`} placeholderTextColor={"rgba(242, 255, 99, 1)"} style={styles.editText}></TextInput>
                <Text style={styles.tableText}> {`${intake.amount === 1 ? intake.measurement.slice(0, intake.measurement.length - 1) : intake.measurement}`}</Text>
              </View>,
              `${intake.caffeine} mg`,
              date,
              <Pressable
                onPress={() => {
                  showNotesModal(intake.notes, intake.id);
                }}
              >
                <Text style={styles.tableText}>
                  <MaterialCommunityIcons name="note" />
                </Text>
              </Pressable>,
              <Pressable
                onPress={() => {
                  twoOptionDeleteHandler(intake.id, "token");
                }}
              >
                <Text style={styles.trashCan}>
                  <MaterialCommunityIcons name="trash-can-outline" />
                </Text>
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
    console.log(intakes);
  }, [intakes]);

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
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
            <Text style={styles.modalHeader}>Note</Text>
            <View>
              <TextInput style={styles.notesInput} maxLength={1000} editable={edit ? true : false} onChangeText={setCurrentNote} placeholder="Notes" value={currentNote}></TextInput>
            </View>
            <View style={styles.buttons}>
              {!edit ? (
                <Button
                  onPress={() => {
                    setEdit(true);
                  }}
                  mode="contained"
                  buttonColor="rgba(94, 65, 153, 1)"
                >
                  Edit
                </Button>
              ) : null}
              {edit ? (
                <>
                  <Button
                    onPress={() => {
                      editNote(currentNoteId, "token");
                    }}
                    mode="contained"
                    buttonColor="rgba(94, 65, 153, 1)"
                  >
                    Save
                  </Button>
                  <Button
                    onPress={() => {
                      setEdit(false);
                      setCurrentNote(originalNote);
                    }}
                    mode="contained"
                    buttonColor="rgba(94, 65, 153, 1)"
                  >
                    Cancel Edit
                  </Button>
                </>
              ) : null}
              <Button onPress={() => cancelNotes()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                Close
              </Button>
            </View>
          </Modal>
        </Portal>
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
  modalHeader: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 22,
    padding: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  notesInput: {
    color: "black",
    fontFamily: "CrimsonPro_400Regular",
    borderRadius: 8,
    borderColor: "rgba(242, 255, 99, 1)",
    backgroundColor: "white",
    borderWidth: 1,
    padding: 10,
    margin: 10,
    fontSize: 18,
  },
  trashCan: {
    textAlign: "center",
    color: "rgba(255, 99, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 14,
  },
  containerStyle: {
    margin: 20,
    backgroundColor: "rgba(157, 108, 255, 1)",
    borderRadius: 20,
    padding: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
