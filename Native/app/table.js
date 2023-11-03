import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert
} from "react-native";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from "../components/Footer";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";
import { LogBox } from "react-native";
import * as SplashScreen from 'expo-splash-screen';

LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell', "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first."]);


export default function CaffeineTable() {
  const [intakes, setIntakes] = useState([0]);
  const tableHead = ["Drink", "Amount", "Caffeine content", "Date", ""];
  const [tableData, setTableData] = useState([]);
  const [token, setToken] = useState("");
  const [deleteSuccessful, setDeleteSuccessful] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const elementButton = (text) => (
    <Pressable
      onPress={() => {
        console.log(tableRow);
      }}
    >
      <Text style={styles.tableText}>{text}</Text>
    </Pressable>
  );

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const twoOptionAlertHandler = (intake, token) => {
    console.log("INTAKE TO BE DELETED =>", intake)
    //function to make two option alert
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure?',
      [
        { text: 'Yes', onPress: () => deleteIntake(intake, token)},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
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
        console.log("TOKEN WITHIN DELETE FUNCTION", token);
        const data = {};
        data.id = id;
        const fetchConfig = {
          method: "post",
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
          console.log(data);
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
          console.log("DATA", data);
          console.log("Fetch successful");
          setIntakes(data.intakes);
          const tableDataToSet = [];
          let rowNumber = 1;
          for (intake of data.intakes) {
            const tableRow = [];
            tableRow.push(
              intake.type,
              `${intake.amount} ${
                intake.amount === 1
                  ? intake.measurement.slice(0, intake.measurement.length - 1)
                  : intake.measurement
              }`,
              intake.caffeine,
              intake.date,
              <Pressable
                onPress={() => {
                  twoOptionAlertHandler(intake.id, "token");
                }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            );
            // rowNumber += 1;
            tableDataToSet.push(tableRow);
          }
          setTableData(tableDataToSet);
          setUserLoggedIn(true);
          await SplashScreen.hideAsync();

        } else {
          console.error("Fetch failed");
          await SplashScreen.hideAsync();
        }
      } else {
        console.log("Could not retrieve token from store");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    populateData("token");
  }, [deleteSuccessful]);
  useEffect(() => console.log("Table data", tableData), [tableData]);

  if (!userLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.mainContainer}>
            <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
            <Text style={styles.bodyText}>Login or make an account to display your caffeine intake.</Text>
          </View>
        </ImageBackground>
        <StatusBar style="auto" />
        <Footer />
      </SafeAreaView>
    );
  }
  else if (intakes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
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
        </ImageBackground>
        <StatusBar style="auto" />
        <Footer />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
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
        </ImageBackground>
        <StatusBar style="auto" />
        <Footer />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    padding: 15,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "center",
    padding: 10,
    borderRadius: 4,
    width: "100%",
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
    marginTop:10,
  },
  tableText: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
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
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  logo: {
    width: 55,
    height: 55,
  },
  tableHeader: {
    backgroundColor: "#DCDCDC",
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
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
});
