import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";
import { TextInput } from "react-native-gesture-handler";
import { caffeineContent } from "../caffeineContent";
import { Divider, Portal, Modal, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function CaffeineTable() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [caffeine, setCaffeine] = useState(0);
  const [intakes, setIntakes] = useState([0]);
  const tableHead = ["Drink", "Amount,\nTap edit", "Caffeine content", "Date", "Notes", "Delete"];
  const [tableData, setTableData] = useState([]);
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [editSuccessful, setEditSuccessful] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [editNotes, setEditNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [originalNote, setOriginalNote] = useState(null);
  const [currentAmount, setCurrentAmount] = useState("");
  const [currentMeasurement, setCurrentMeasurement] = useState(0);
  const [currentBeverage, setCurrentBeverage] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [currentAmountId, setCurrentAmountId] = useState(null);

  const showNotesModal = (note, id) => {
    setCurrentNote(note);
    setOriginalNote(note);
    setCurrentNoteId(id);
    setNotesModalVisible(true);
  };
  const showAmountModal = (amount, id, measurement, beverage) => {
    setCurrentAmount(amount);
    setCurrentAmountId(id);
    setCurrentMeasurement(measurement);
    setCurrentBeverage(beverage);
    setAmountModalVisible(true);
  };
  const hideNotesModal = () => {
    setNotesModalVisible(false);
  };
  const hideAmountModal = () => {
    setAmountModalVisible(false);
  };
  const cancelNotes = () => {
    setNotesModalVisible(false);
    setEditNotes(false);
    setCurrentNote(currentNote);
    setCurrentNoteId(null);
  };
  const cancelAmount = () => {
    setCurrentAmount(0);
    setCurrentAmountId(null);
    setAmountModalVisible(false);
  };

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
        const response = await fetch(`${apiUrl}/caffeine/`, fetchConfig);
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

  function calculateCaffeineContent(measurement, beverage) {
    for (let drink of caffeineContent) {
      if (drink["title"] == beverage) {
        if (measurement === "floz") {
          setCaffeine(drink["mg/floz"] * currentAmount);
        } else if (measurement === "cups") {
          setCaffeine(drink["mg/floz"] * currentAmount * 8);
        } else if (measurement === "ml") {
          setCaffeine((drink["mg/floz"] * currentAmount) / 29.5735);
        }
      }
    }
  }

  useEffect(() => calculateCaffeineContent(currentMeasurement, currentBeverage), [currentAmount]);

  async function editIntake(id, key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const data = {};
        data.id = id;
        data.amount = currentAmount;
        data.caffeine = caffeine;
        const fetchConfig = {
          method: "patch",
          headers: {
            "Content-type": "application/json",
            Authorization: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(`${apiUrl}/caffeine/`, fetchConfig);
        if (response.ok) {
          setEditSuccessful(true);
          populateData("token");
          Alert.alert("Edit Successful");
          setAmountModalVisible(false);
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
        const response = await fetch(`${apiUrl}/caffeine/`, fetchConfig);
        if (response.ok) {
          const data = await response.json();
          setOriginalNote("");
          setEditNotes(false);
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
        const fetchConfig = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: result,
          },
        };
        const response = await fetch(`${apiUrl}/caffeine/`, fetchConfig);
        if (response.ok) {
          const data = await response.json();
          setIntakes(data.intakes);
          const tableDataToSet = [];
          for (let intake of data.intakes) {
            const tableRow = [];
            const date = formatDate(intake.date);
            tableRow.push(
              intake.type,
              <Pressable
                onPress={() => {
                  showAmountModal(intake.amount, intake.id, intake.measurement, intake.type);
                }}
              >
                <Text style={styles.tableText}>{`${intake.amount} ${intake.amount === 1 ? intake.measurement.slice(0, intake.measurement.length - 1) : intake.measurement}`}</Text>
              </Pressable>,
              `${intake.caffeine} mg`,
              date,
              <Pressable
                onPress={() => {
                  showNotesModal(intake.notes, intake.id);
                }}
              >
                <Text style={styles.tableText}>
                  <MaterialCommunityIcons size={12} name="note" />
                </Text>
              </Pressable>,
              <Pressable
                onPress={() => {
                  twoOptionDeleteHandler(intake.id, "token");
                }}
              >
                <Text style={styles.trashCan}>
                  <MaterialCommunityIcons size={12} name="trash-can-outline" />
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
          <Modal visible={notesModalVisible} onDismiss={hideNotesModal} contentContainerStyle={styles.containerStyle}>
            <Text style={styles.modalHeader}>
              <Feather name="sun" size={24} color="rgba(242, 255, 99, 1)" />
            </Text>
            {editNotes ? (
              <View>
                <TextInput style={styles.notesInput} maxLength={1000} editable={editNotes ? true : false} onChangeText={setCurrentNote} placeholder="Notes" value={currentNote}></TextInput>
              </View>
            ) : (
              <Text style={styles.modalText}>{currentNote ? currentNote : "No notes added for this date."}</Text>
            )}
            <View style={styles.buttons}>
              {!editNotes && currentNote ? (
                <>
                  <Button
                    onPress={() => {
                      setEditNotes(true);
                    }}
                    mode="contained"
                    buttonColor="rgba(94, 65, 153, 1)"
                  >
                    Edit
                  </Button>
                  <Button onPress={() => cancelNotes()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                    Close
                  </Button>
                </>
              ) : null}
              {!editNotes && !currentNote ? (
                <>
                  <Button
                    onPress={() => {
                      setEditNotes(true);
                    }}
                    mode="contained"
                    buttonColor="rgba(94, 65, 153, 1)"
                  >
                    Add
                  </Button>
                  <Button onPress={() => cancelNotes()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                    Close
                  </Button>
                </>
              ) : null}
              {editNotes ? (
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
                      setEditNotes(false);
                      setCurrentNote(originalNote);
                    }}
                    mode="contained"
                    buttonColor="rgba(94, 65, 153, 1)"
                  >
                    Cancel Edit
                  </Button>
                </>
              ) : null}
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={amountModalVisible} onDismiss={hideAmountModal} contentContainerStyle={styles.containerStyle}>
            <Text style={styles.modalHeader}>
              <Feather name="coffee" size={24} color="rgba(242, 255, 99, 1)" />
            </Text>
            <View>
              <TextInput style={styles.notesInput} maxLength={100} editable onChangeText={setCurrentAmount} placeholder="Notes" value={currentAmount}></TextInput>
            </View>
            <View style={styles.buttons}>
              <Button
                onPress={() => {
                  editIntake(currentAmountId, "token");
                }}
                mode="contained"
                buttonColor="rgba(94, 65, 153, 1)"
              >
                Save
              </Button>
              <Button onPress={() => cancelAmount()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                Cancel
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
    fontFamily: "CrimsonPro_400Regular_Italic",
    fontSize: 22,
    padding: 10,
  },
  modalText: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 20,
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
  notesView: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    backgroundColor: "rgba(157, 108, 255, 1)",
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
