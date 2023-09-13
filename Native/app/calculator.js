import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import { caffeineContent } from '../caffeineContent';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

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

export default function Calculator() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [drink, setDrink] = useState('');
  const [value, setValue] = useState(null);
  const [amount, setChangeAmount] = useState('')
  const [caffeine, setCaffeine] = useState(0)

  const onChangeDrink = drink => {
    setDrink(drink)
  }

  const onChangeAmount = amount => {
    setChangeAmount(amount)
    setCaffeine(drink["mg/floz"] * amount)
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
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              onSelectItem={onChangeDrink}
              dataSet={caffeineContent}
            />
            <Text style={styles.baseText}>How much? In fluid ounces...</Text>
            <TextInput style={styles.input} returnKeyType={ 'done' } editable={drink ? true :false} onChangeText={onChangeAmount} keyboardType="numeric" value={amount} placeholder="mL"></TextInput>
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
