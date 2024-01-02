import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from "@expo/vector-icons";

/* For January you will need 31 data points. If there is nothing for that day, make it (ZERO or THE SAME AS THE PREVIOUS DAY, UNLESS IT'S THE FIRST DAY THEN MAKE IT ZERO)*/

// The question is if there is no data what do you want to do I think the answer is keep it the same as the previous day
// Data type for months display (think of them as separate components even though they won't be) should be list of lists where each list has the caffeine count for each day of that month

export default function Graph() {
  function daysInThisMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [intakes, setIntakes] = useState([]);
  const [totalCaffeine, setTotalCaffeine] = useState([0]);
  const [weekStart, setWeekStart] = useState(0);
  const [weekEnd, setWeekEnd] = useState(7);
  const [currentMonthNumeric, setCurrentMonthNumeric] = useState(new Date().toLocaleString("default", { month: "numeric" }));
  const [currentMonthText, setCurrentMonthText] = useState(new Date().toLocaleString("default", { month: "long" }));
  // const currentWeek = [`${currentMonthText}-${currentDay}`, `${currentMonthText}-${currentDay + 1}`, `${currentMonthText}-${currentDay + 2}`, `${currentMonthText}-${currentDay + 3}`, `${currentMonthText}-${currentDay + 4}`, `${currentMonthText}-${currentDay + 5}`, `${currentMonthText}-${currentDay + 6}`];
  const dates = daysInThisMonth();
  const [monthsCaffeine, setMonthsCaffeine] = useState([...Array(dates)].map((date) => 0));
  const monthLength = [...Array(dates)].map((date) => 0);
  const [thisWeeksCaffeine, setThisWeeksCaffeine] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [fetchSuccessful, setFetchSuccessful] = useState(false);

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
          const weeksCaffeine = [];
          // for (let i = 0; i < 7; i++) {
          //   let intakeMonth = 0;
          //   if (intakes[i]) {
          //     intakeMonth = formatDate(intakes[i]["date"]);
          //   }
          //   // if this Date is in currentWeek at i then you have to add the caffeine to weeksCaffeine at that index to stack caffeine consumption on a given day
          //   if (intakeMonth === currentWeek[i]) {
          //     weeksCaffeine.push(intakes[i]["caffeine"]);
          //   } else {
          //     weeksCaffeine.push(weeksCaffeine[i - 1]);
          //   }
          // }
          // setThisWeeksCaffeine(weeksCaffeine);
          const thisMonthsCaffeine = [];
          console.log(monthLength.length);
          for (let i = 0; i < monthLength.length; i++) {
            console.log("FDJSAKFSJ");
            let intakeMonth = intakes[i] ? formatDate(intakes[i]["date"]).split("-")[0] : undefined;
            if (intakeMonth === currentMonthNumeric) {
              thisMonthsCaffeine.push(intakes[i]["caffeine"]);
            } else {
              thisMonthsCaffeine.push(0);
            }
            console.log("FORMAT DATE DATE:", intakeMonth);
            console.log("MONTH NUMERIC:", currentMonthNumeric);
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
  }, []);
  useEffect(() => console.log("Intakes", intakes), [intakes]);
  // useEffect(() => console.log("Fetch successful", fetchSuccessful), [fetchSuccessful]);
  useEffect(() => console.log("Months Caffeine", monthsCaffeine), [monthsCaffeine]);

  if (1) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Your Caffeine Intake (mg)</Text>
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
              r: "0.5",
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
            <Text style={styles.dayText}>
              <AntDesign name="arrowleft" size={16} color="rgba(242, 255, 99, 1)" /> Previous Month
            </Text>
          </Pressable>
          {/* <Text style={styles.week}>Week {weekStart + 1}</Text> */}
          <Pressable onPress={nextDay}>
            <Text style={styles.dayText}>
              Next Month <AntDesign name="arrowright" size={16} color="rgba(242, 255, 99, 1)" />
            </Text>
          </Pressable>
        </View>
        <Text style={styles.monthText}>{currentMonthText}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.headerText}>Your Caffeine intake (mg)</Text>
        <LineChart
          data={{
            labels: [0],
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
  monthText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    marginTop: 10,
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
  week: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
  },
});
