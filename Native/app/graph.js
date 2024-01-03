import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from "@expo/vector-icons";
import { G } from "react-native-svg";

/* For January you will need 31 data points. If there is nothing for that day, make it (ZERO or THE SAME AS THE PREVIOUS DAY, UNLESS IT'S THE FIRST DAY THEN MAKE IT ZERO)*/

// The question is if there is no data what do you want to do I think the answer is keep it the same as the previous day
// Data type for months display (think of them as separate components even though they won't be) should be list of lists where each list has the caffeine count for each day of that month

export default function Graph() {
  function daysInThisMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [intakes, setIntakes] = useState([]);
  const [totalCaffeine, setTotalCaffeine] = useState([0]);
  const currentMonth = new Date();
  const dates = daysInThisMonth(currentMonth);
  const [currentMonthNumeric, setCurrentMonthNumeric] = useState(currentMonth.toLocaleString("default", { month: "numeric" }));
  const [currentMonthText, setCurrentMonthText] = useState(currentMonth.toLocaleString("default", { month: "long" }));
  const [monthsCaffeine, setMonthsCaffeine] = useState([...Array(dates)].map((date) => 0));
  const daysInMonth = [...Array(dates)].map((date) => "_");
  const [fetchSuccessful, setFetchSuccessful] = useState(false);
  const widthW = Dimensions.get("window").width;

  async function populateData(key) {
    const formatDate = (fullDate) => {
      let splitDate = fullDate.split("-");
      let shortenedDate = "";
      if (splitDate[1][0] === "0") {
        shortenedDate += splitDate[1][1];
      } else {
        shortenedDate += splitDate[1];
      }
      shortenedDate += "-";
      if (splitDate[2][0] === "0") {
        shortenedDate += splitDate[2][1];
      } else {
        shortenedDate += splitDate[2];
      }
      return shortenedDate;
    };
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const fetchConfig = {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authentication: result,
          },
        };
        const response = await fetch(`${apiUrl}/caffeine/list_caffeine/`, fetchConfig);
        if (response.ok) {
          const data = await response.json();
          setIntakes(data.intakes);
          const thisMonthsCaffeine = [];
          for (let i = 0; i < daysInMonth.length; i++) {
            let intakeMonth = intakes[i] ? formatDate(intakes[i]["date"]).split("-")[0] : undefined;
            if (intakeMonth === currentMonthNumeric) {
              thisMonthsCaffeine.push(intakes[i]["caffeine"]);
            } else {
              thisMonthsCaffeine.push(0);
            }
          }
          setMonthsCaffeine(thisMonthsCaffeine);
          setFetchSuccessful(true);
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
  }, [fetchSuccessful]);
  useEffect(() => console.log("Intakes", intakes), [intakes]);
  // useEffect(() => console.log("Fetch successful", fetchSuccessful), [fetchSuccessful]);
  useEffect(() => console.log("Months Caffeine", monthsCaffeine), [monthsCaffeine]);
  useEffect(() => {}, [monthsCaffeine]);

  if (fetchSuccessful) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <Text style={styles.monthText}>{currentMonthText}</Text>
        <LineChart
          fromZero="True"
          data={{
            labels: [],
            datasets: [
              {
                data: monthsCaffeine,
              },
            ],
          }}
          width={widthW + widthW / (data.length - 1)}
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            horizontalOffset: 0,
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
              r: "1",
              strokeWidth: "2.5",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginTop: 8,
            borderRadius: 16,
          }}
        />
        <View style={styles.changeDates}>
          <Pressable onPressIn={previousDay}>
            <Text style={styles.dayText}>
              <AntDesign name="arrowleft" size={16} color="rgba(242, 255, 99, 1)" /> Last Month
            </Text>
          </Pressable>
          {/* <Text style={styles.week}>Week {weekStart + 1}</Text> */}
          <Pressable onPress={nextDay}>
            <Text style={styles.dayText}>
              Next Month <AntDesign name="arrowright" size={16} color="rgba(242, 255, 99, 1)" />
            </Text>
          </Pressable>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <ActivityIndicator animating={true} color={"rgba(242, 255, 99, 1)"} size={"large"} style={{ padding: 50 }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "center",
    padding: 10,
    width: "100%",
    borderRadius: 4,
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 26,
    textAlign: "center",
  },
  monthText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    marginTop: 5,
    // borderRadius: 2,
    // borderColor: "rgba(242, 255, 99, 0.75)",
    // borderWidth: 2,
    fontSize: 22,
    textAlign: "center",
  },
  dayText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 16,
    padding: 8.4,
    borderColor: "rgba(242, 255, 99, 0.75)",
    borderWidth: 2,
    borderRadius: 22,
    marginLeft: 14,
    marginRight: 14,
  },
  changeDates: {
    flexDirection: "row",
    justifyContent: "center",
  },
  week: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
  },
});
