import React, { useState, useEffect, useRef } from "react";
import { caffeineContent } from "../caffeineContent";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Divider, Button, Portal, Modal } from "react-native-paper";

export default function Calculator() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [drink, setDrink] = useState("");
  const [measurement, setMeasurement] = useState(null);
  const [items, setItems] = useState([
    { label: "fl oz", value: "floz" },
    { label: "cups", value: "cups" },
    { label: "mL", value: "ml" },
  ]);
  const [amount, setAmount] = useState(0);
  const [caffeine, setCaffeine] = useState(0);
  const dropdownController = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [notes, setNotes] = useState(null);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };
  const cancelNotes = () => {
    setNotes("");
    setVisible(false);
  };

  const onOpenSuggestionsList = () => setOpen(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  async function getValueFor(key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        setToken(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onChangeDrink = (drink) => {
    setDrink(drink);
  };

  const onChangeNotes = (text) => {
    setNotes(text);
  };

  const onChangeAmount = (amount) => {
    setAmount(amount);
    if (measurement === "floz") {
      setCaffeine(drink["mg/floz"] * amount);
    } else if (measurement === "cups") {
      setCaffeine(drink["mg/floz"] * amount * 8);
    } else if (measurement === "ml") {
      setCaffeine((drink["mg/floz"] * amount) / 29.5735);
    }
  };

  const swapDrink = (amount) => {
    if (drink === null) {
    } else {
      onChangeAmount(amount);
    }
  };

  useEffect(() => {
    swapDrink(amount);
  }, [drink, measurement]);
  useEffect(() => {
    getValueFor("token");
  }, []);

  const addIntake = async () => {
    const data = {};
    data.caffeine = parseInt(caffeine);
    data.date = selectedDate.toLocaleDateString("fr-CA");
    data.type = drink["title"];
    data.amount = amount;
    data.notes = notes;
    data.measurement = measurement;
    const fetchConfig = {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(`${apiUrl}/caffeine/`, fetchConfig);
    if (response.ok) {
      setAmount(0);
      setCaffeine(0);
      setMeasurement(null);
      setDrink("");
      setNotes("");
      dropdownController.current.clear();
      Alert.alert("Intake added", "", [{ text: "OK" }]);
    } else {
      console.log("Post failed");
    }
  };

  return (
    <View style={styles.calculatorContainer}>
      <Text style={styles.headerText}>Calculator</Text>
      <Divider style={{ margin: 12 }} bold="true" horizontalInset="true" />
      <Text style={styles.noMarginText}>What drink are you having?</Text>
      <AutocompleteDropdown
        containerStyle={styles.dropdown}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        clearOnFocus={false}
        closeOnBlur={false}
        closeOnSubmit={false}
        onSelectItem={onChangeDrink}
        dataSet={caffeineContent}
        onOpenSuggestionsList={onOpenSuggestionsList}
        textInputProps={{ maxLength: 39 }}
      />
      <Text style={styles.marginText}>How much?</Text>
      <View style={open ? styles.howMuchOpen : styles.howMuchClosed}>
        {drink && measurement ? (
          <TextInput style={styles.input} returnKeyType={"done"} maxLength={5} editable={true} onChangeText={onChangeAmount} inputMode="numeric" keyboardType="number-pad" value={amount.toString()} placeholder="Amount"></TextInput>
        ) : (
          <Pressable style={styles.input} onPress={() => alert("Select drink and measurement before editing amount")}>
            <View pointerEvents="none">
              <TextInput editable={false} placeholder="Amount"></TextInput>
            </View>
          </Pressable>
        )}
        <DropDownPicker open={open} value={measurement} items={items} setOpen={setOpen} setValue={setMeasurement} setItems={setItems} containerStyle={{ width: "50%" }} style={{ borderWidth: 0, zIndex: 1 }} placeholder="Unit of measurement" />
      </View>
      {token ? (
        <>
          <Divider style={{ margin: 12 }} horizontalInset="true" />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button mode="contained" buttonColor="rgba(94, 65, 153, 1)" icon="note" style={{ marginBottom: 10, justifyContent: "center", width: "100%" }} onPress={() => showModal()}>
              Notes (optional)
            </Button>
            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                <Text style={styles.modalHeader}>Notes</Text>
                <View>
                  <TextInput style={styles.notesInput} maxLength={640} onChangeText={setNotes} placeholder="Notes" value={notes}></TextInput>
                </View>
                <View style={styles.buttons}>
                  <Button onPress={() => hideModal()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                    Confirm
                  </Button>
                  <Button onPress={() => cancelNotes()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                    Cancel
                  </Button>
                </View>
              </Modal>
            </Portal>
          </View>
        </>
      ) : null}
      <Divider style={token ? { marginBottom: 12 } : { margin: 12 }} horizontalInset="true" />
      <Text style={styles.noMarginText}>You've consumed {parseInt(caffeine)} mg of caffeine.</Text>
      <View style={styles.calendar}></View>
      {token ? (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            buttonColor="rgba(94, 65, 153, 1)"
            icon="calendar"
            onPress={() => {
              showDatePicker();
            }}
          >
            {selectedDate ? selectedDate.toLocaleDateString() : "No date selected"}
          </Button>
          <DateTimePickerModal date={selectedDate} isVisible={datePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
          <Button
            mode="contained"
            buttonColor="rgba(94, 65, 153, 1)"
            onPress={() => {
              addIntake();
            }}
            icon="check"
          >
            Save
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  calculatorContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.7)",
    width: "100%",
    justifyContent: "center",
    borderRadius: 4,
    padding: 10,
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 30,
    textAlign: "center",
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
  marginText: {
    marginTop: 6,
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 24,
    textAlign: "center",
  },
  noMarginText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 24,
    textAlign: "center",
  },
  input: {
    color: "black",
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 0,
    width: "45%",
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  dropdown: {
    marginTop: 10,
    zIndex: 100,
  },
  howMuchOpen: {
    zIndex: 100,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  howMuchClosed: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addButtonText: {
    textAlign: "center",
    padding: 8.8,
    borderColor: "rgba(242, 255, 99, 1)",
    borderWidth: 2,
    borderRadius: 22,
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 20,
    color: "rgba(242, 255, 99, 1)",
  },
  calendar: {
    alignItems: "center",
    marginTop: 20,
  },
});
