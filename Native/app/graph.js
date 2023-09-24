import React, {useState, useEffect} from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from '../components/Footer';
import {LineChart} from 'react-native-chart-kit';
import * as SecureStore from 'expo-secure-store';

export default function Graph() {

  const [token, setToken] = useState(null);
  const [intakes, setIntakes] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [dates, setDates] = useState([]);
  const [fetchSuccessful, setFetchSuccessful] = useState(false);

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setToken(result);
      console.log("Token fetched successfully", token)
    } else {
      console.log("Could not retrieve token from store")
    }
  }


  async function fetchIntakes() {
    const fetchConfig = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authentication": token,
      },
    };
    const response = await fetch("http://192.168.86.105:8000/users/list_caffeine", fetchConfig);
    if (response.ok) {
        const data = await response.json();
        console.log("Fetch successful");
        setIntakes(data.intakes);
        console.log("INTAKES", intakes);
        const amountsArray = intakes.map(intake => intake.amount);
        setAmounts(amountsArray);
        const datesArray = intakes.map(intake => intake.date.slice(5));
        setDates(datesArray);
        console.log("DATES", dates);
        console.log("Hi")
        setFetchSuccessful(true);
    } else {
      console.error("Fetch failed");
    }
  };
  useEffect(() => {getValueFor("token")}, []);
  useEffect(() => {fetchIntakes()}, [token]); 

  var month = new Date().getMonth() + 1;

  function daysInThisMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  };
  
  var days = daysInThisMonth();
  var eachDay = []
  for (var day = 1; day <= days; day++) {
    eachDay.push(day)
  }
  var datesThisMonth = eachDay.map(day => `${month}/${day}`);

  if (fetchSuccessful) {
    SplashScreen.hideAsync();
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.homeContainer}>
            <Text style={styles.headerText}>Caffeine intake (mg)</Text>
             <LineChart
    data={{
      labels: dates,
      datasets: [
        {
          data: amounts
        }
      ]
    }}
    width={Dimensions.get("window").width}
    height={220}
    yAxisLabel=""
    yAxisSuffix=""
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "none",
      backgroundGradientFrom: "none",
      backgroundGradientTo: "none",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "center",
    padding:10,
    borderRadius: 4
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
    paddingBottom: 20
  },
  logo: {
    width: 55,
    height: 55,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 10,
    alignContent: "center"
  },
  unpressedText: {
    color: "rgba(94, 25, 121, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline"
  },
  pressedText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textDecorationLine: "underline"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
});
