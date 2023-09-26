import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from "../components/Footer";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";
import { Table, Row, Rows } from "react-native-table-component";

export default function CaffeineTable() {
  const [intakes, setIntakes] = useState([0]);
  const [amounts, setAmounts] = useState([0]);
  const [totalCaffeine, setTotalCaffeine] = useState([0]);
  const [dates, setDates] = useState([0]);
  const tableHead = ["Drink", "Amount", "Caffeine content"];
  const tableData = [
    ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
    ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
    ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
  ];

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  async function populateData(key) {
    try {
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
          const amountsArray = data.intakes.map((intake) => intake.caffeine);
          setAmounts(amountsArray);
          const datesArray = data.intakes.map((intake) => intake.date.slice(5));
          datesToSet = [...new Set(datesArray)];
          setDates(datesToSet);
          //calculate total caffeine and store it in variable then render it in graph
          const caffArray = [];
          let dailyCaffeine = 0;
          for (d of datesToSet) {
            for (intake of data.intakes) {
              if (intake.date.slice(5) === d) {
                dailyCaffeine += intake.caffeine;
              }
            }
            caffArray.push(dailyCaffeine);
          }
          setTotalCaffeine(caffArray);
        } else {
          console.error("Fetch failed");
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
  }, []);
  useEffect(() => console.log("Intakes", intakes), [intakes]);
  useEffect(() => console.log("Dates", dates), [dates]);
  useEffect(
    () => console.log("Total Caffeine", totalCaffeine),
    [totalCaffeine]
  );

  // var month = new Date().getMonth() + 1;

  // function daysInThisMonth() {
  //   var now = new Date();
  //   return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  // };

  // var days = daysInThisMonth();
  // var eachDay = []
  // for (var day = 1; day <= days; day++) {
  //   eachDay.push(day)
  // }
  // var datesThisMonth = eachDay.map(day => `${month}/${day}`);

  if (intakes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Your Caffeine intake (mg)</Text>
            <LineChart
              data={{
                labels: [
                  `${new Date().getMonth() + 1}-${new Date().getDate()}`,
                ],
                datasets: [
                  {
                    data: [0],
                  },
                ],
              }}
              width={Dimensions.get("window").width}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
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
          <View style={styles.homeContainer}>
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
  homeContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "center",
    padding: 10,
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
