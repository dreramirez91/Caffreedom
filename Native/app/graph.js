import React, {useState, useEffect} from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Pressable,
  Dimensions
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import logo from "../assets/logo.png";
import Footer from '../components/footer';
import {LineChart} from 'react-native-chart-kit';

export default function Graph() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const [intakes, setIntakes] = useState([]);
  async function fetchIntakes() {
    const response = await fetch("http://localhost:8000/users/list_caffeine");
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        setIntakes(data.intakes)
    }
  };
  useEffect(() => {fetchIntakes()}, []); // Must login to be able to fetch this data

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
  console.log(datesThisMonth)

  if (fontsLoaded) {
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
      labels: datesThisMonth.slice(1,8), // You want to be able to press an arrow and change the labels or display by weeks...
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
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
  } else {
    return null;
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
