import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from "@expo/vector-icons";
import { Divider } from "react-native-paper";

/* For January you will need 31 data points. If there is nothing for that day, make it (ZERO or THE SAME AS THE PREVIOUS DAY, UNLESS IT'S THE FIRST DAY THEN MAKE IT ZERO)*/

// The question is if there is no data what do you want to do I think the answer is keep it the same as the previous day
// Data type for months display (think of them as separate components even though they won't be) should be list of lists where each list has the caffeine count for each day of that month

export default function Graph() {
  function daysInThisMonth(date) {
    console.log("DATE IN THE MOTHAFUCKIN FN", typeof date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [intakes, setIntakes] = useState([]);
  const [totalCaffeine, setTotalCaffeine] = useState([0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dates = daysInThisMonth(currentMonth);
  const [currentMonthNumeric, setCurrentMonthNumeric] = useState(currentMonth.toLocaleString("default", { month: "numeric" }));
  const [currentMonthText, setCurrentMonthText] = useState(currentMonth.toLocaleString("default", { month: "long" }));
  const [currentYearNumeric, setCurrentYearNumeric] = useState(currentMonth.toLocaleString("default", { year: "numeric" }));
  const [monthsCaffeine, setMonthsCaffeine] = useState([...Array(dates)].map((date) => 0));
  const daysInMonth = [...Array(dates)].map((date) => "_");
  const [fetchSuccessful, setFetchSuccessful] = useState(false);

  async function populateData(key) {
    const formatDate = (fullDate) => {
      console.log("fdafjkdfjafda", fullDate);
      let splitDate = fullDate.split("-");
      console.log("SPLIT DATE", splitDate);
      let shortenedMonth = "";
      if (splitDate[1][0] === "0") {
        shortenedMonth += splitDate[1][1];
      } else {
        shortenedMonth += splitDate[1];
      }
      shortenedMonth += "-";
      if (splitDate[2][0] === "0") {
        shortenedMonth += splitDate[2][1];
      } else {
        shortenedMonth += splitDate[2];
      }
      // console.log("fdafkdfjdaskfda", shortenedMonth);
      const formattedDate = `${splitDate[0]}-${shortenedMonth}`;
      return formattedDate;
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
            let intakeMonth = intakes[i] ? formatDate(intakes[i]["date"]).split("-")[1] : undefined;
            let intakeYear = intakes[i] ? formatDate(intakes[i]["date"]).split("-")[0] : undefined;
            // let intakeMonth = intakes[i] ? formatDate(intakes[i]["date"]).split("-")[1] : undefined;
            if (intakeMonth === currentMonthNumeric && intakeYear === currentYearNumeric) {
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

  const nextMonth = () => {
    const thisMonth = currentMonth;
    setCurrentMonth(new Date(thisMonth.setMonth(currentMonth.getMonth() + 1)));
    setCurrentMonthNumeric(currentMonth.toLocaleString("default", { month: "numeric" }));
    setCurrentYearNumeric(currentMonth.toLocaleString("default", { year: "numeric" }));
    setCurrentMonthText(currentMonth.toLocaleString("default", { month: "long" }));
    // why do I need new Date above??
  };

  const lastMonth = () => {
    const thisMonth = currentMonth;
    setCurrentMonth(new Date(thisMonth.setMonth(currentMonth.getMonth() - 1)));
    setCurrentMonthNumeric(currentMonth.toLocaleString("default", { month: "numeric" }));
    setCurrentYearNumeric(currentMonth.toLocaleString("default", { year: "numeric" }));
    setCurrentMonthText(currentMonth.toLocaleString("default", { month: "long" }));
    console.log("CURRENT YEAR", currentMonth.getFullYear());
  };

  useEffect(() => {
    populateData("token");
  }, [fetchSuccessful, currentMonth]);
  useEffect(() => console.log("Intakes", intakes), [intakes]);
  // useEffect(() => console.log("Fetch successful", fetchSuccessful), [fetchSuccessful]);
  useEffect(() => console.log("Current month", currentMonth.getMonth()), [currentMonth]);

  if (fetchSuccessful) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
        <Divider style={{ margin: 6 }} bold="true" />
        <Text style={styles.monthText}>
          {currentMonthText} {currentYearNumeric}
        </Text>
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
          width={Dimensions.get("window").width}
          height={220}
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
            paddingRight: Dimensions.get("window").width * 0.11, // (change to the percentage that fit better for yout)
          }}
        />
        <View style={styles.changeDates}>
          <Pressable onPressIn={lastMonth}>
            <Text style={styles.dayText}>
              <AntDesign name="arrowleft" size={16} color="rgba(242, 255, 99, 1)" /> Last Month
            </Text>
          </Pressable>
          <Pressable onPress={nextMonth}>
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
    fontSize: 24,
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
});
