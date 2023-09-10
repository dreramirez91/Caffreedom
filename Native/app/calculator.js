import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from '../components/footer';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Calculator() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{ label: 'Coffee (black)', value: 'coffee_black'},{ label: 'Cold brew', value: 'cold_brew'},{ label: 'Black tea', value: 'tea_black'}]);
  const [amount, setChangeAmount] = useState('')
  const [caffeine, setCaffeine] = useState(0)

  const caffeinePerMl = {
    "coffee_black": .3958,
    "cold_brew": .423,
    "tea_black": .2292

  }

  const onChangeAmount = amount => {
    setChangeAmount(amount)
    setCaffeine(caffeinePerMl[value] * amount)
  }

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const Separator = () => <View style={styles.separator} />;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.calculatorContainer}>
            <Text style={styles.headerText}>Calculator</Text>
            <Text style={styles.baseText}>What drink are you having?</Text>
            <DropDownPicker style={{marginTop: 10}} open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text style={styles.baseText}>How much? In milliliters...</Text>
            <TextInput style={styles.input} editable={value ? true :false} onChangeText={onChangeAmount} keyboardType="numeric" value={amount} placeholder="mL"></TextInput>
            <Text style={styles.baseText}>You have consumed {parseInt(caffeine)} mg of caffeine.</Text>
          </View>
        </ImageBackground>
        <Footer />
        <StatusBar style="auto" />
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
  calculatorContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    width: "80%",
    justifyContent: "center",
    borderRadius: 4,
    padding:10
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 24,
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
  baseText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    marginTop: 10,
    textAlign: "center"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    height: 50,
    width: '100%',
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10
  }
});
