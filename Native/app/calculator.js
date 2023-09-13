import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import { caffeineContent } from '../caffeineContent';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from '../components/footer';
import DropDownPicker from 'react-native-dropdown-picker';
import logo from "../assets/logo.png";

export default function Calculator() {
  const drinks = caffeineContent.map((index, drink) => {return drink["drink"], key=index})
  console.log(drinks)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(drinks);
  const [amount, setChangeAmount] = useState('')
  const [caffeine, setCaffeine] = useState(0)

  const onChangeAmount = amount => {
    setChangeAmount(amount)
    setCaffeine(value * amount)
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
            <DropDownPicker style={{marginTop: 10}} key={drinks} open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text style={styles.baseText}>How much? In milliliters...</Text>
            <TextInput style={styles.input} returnKeyType={ 'done' } editable={value ? true :false} onChangeText={onChangeAmount} keyboardType="numeric" value={amount} placeholder="mL"></TextInput>
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
    backgroundColor: "rgba(157, 108, 255, 0.7)",
    width: "80%",
    justifyContent: "center",
    borderRadius: 4,
    padding: 10

  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 24,
    textAlign: "center",
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
