import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Pressable,
} from "react-native";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";

export default function Graph() {
  const [intakes, setIntakes] = useState([]);
  const [amounts, setAmounts] = useState([0]);
  const [totalCaffeine, setTotalCaffeine] = useState([0]);
  const [dates, setDates] = useState([0]);
  const [weekStart, setWeekStart] = useState(0);
  const [weekEnd, setWeekEnd] = useState(7);
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
          "http://172.16.121.190:8000/users/list_caffeine",
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
          datesToSet.sort();
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
            dailyCaffeine = 0;
          }
          setTotalCaffeine(caffArray);
          console.log("Total caffeine =>", totalCaffeine);
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

  const nextDay = () => {
    if (weekEnd === totalCaffeine.length) {
    } else {
      setWeekStart(weekStart + 1);
      setWeekEnd(weekEnd + 1);
    }
  };

  const previousDay = () => {
    if (weekStart == 0) {
    } else {
      setWeekStart(weekStart - 1);
      setWeekEnd(weekEnd - 1);
    }
  };

  useEffect(() => {
    populateData("token");
  }, []);
  useEffect(() => console.log("Intakes", intakes), [intakes]);
  useEffect(() => console.log("Dates", dates), [dates]);
  useEffect(
    () => console.log("Total Caffeine", totalCaffeine),
    [totalCaffeine]
  );

  if (intakes.length === 0) {
    return (
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
    );
  } else {
    return (
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
            <LineChart
              fromZero="True"
              data={{
                labels: dates.slice(weekStart, weekEnd),
                datasets: [
                  {
                    data: totalCaffeine.slice(weekStart, weekEnd),
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
            <View style={styles.changeDates}>
              <Pressable onPressIn={previousDay}>
                {/* <MaterialCommunityIcons
                  name="calendar-arrow-left"
                  size={24}
                  color="rgba(242, 255, 99, 1)"
                /> */}
                <Text style={styles.dayText}>Previous Day</Text>
              </Pressable>
              {/* <Text style={styles.week}>Week {weekStart + 1}</Text> */}
              <Pressable onPress={nextDay}>
                {/* <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  size={24}
                  color="rgba(242, 255, 99, 1)"
                /> */}
                <Text style={styles.dayText}>Next Day</Text>
              </Pressable>
            </View>
          </View>
    );
  }
}
const styles = StyleSheet.create({
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
  dayText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 16,
    padding: 8.4,
    borderColor: "rgba(242, 255, 99, 0.75)",
    borderWidth: 2,
    borderRadius: 4,
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
  changeDates: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    

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
  week: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
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
