import React, {useState, useEffect, useRef} from 'react';
import { StatusBar } from "expo-status-bar";
import { caffeineContent } from '../caffeineContent';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import Footer from '../components/Footer';
import * as SecureStore from 'expo-secure-store';

SplashScreen.hideAsync();

export default function Calculator() {
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [drink, setDrink] = useState('');
  const [measurement, setMeasurement] = useState(null)
  const [items, setItems] = useState([
    {label: 'fl oz', value: 'floz'},
    {label: 'cups', value: 'cups'},
    {label: 'mL', value: 'ml'}
  ]);
  const [amount, setAmount] = useState(0)
  const [caffeine, setCaffeine] = useState(0)
  const dropdownController = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

  async function getValueFor(key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        console.log("Successfully retrieved token from store", result);
        setToken(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onChangeDrink = drink => {
    console.log(drink)
    setDrink(drink)
  }

  const onChangeAmount = amount => {
    setAmount(amount)
    if (measurement === 'floz') {setCaffeine(drink["mg/floz"] * amount)}
    else if (measurement === 'cups') {setCaffeine(drink["mg/floz"] * amount * 8 )}
    else if (measurement === 'ml') {setCaffeine((drink["mg/floz"] * amount)/29.5735 )}
  }

  const swapDrink = (amount) => {
    if (drink === null) {
    } else {onChangeAmount(amount);}
  }

  useEffect(() => {swapDrink(amount)}, [drink, measurement]);
  useEffect(() => {getValueFor("token")}, [])

  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const Separator = () => <View style={styles.separator} />;

  const addIntake = async () => {
    const data = {};
    data.amount = parseInt(caffeine);
    data.date = new Date().toISOString().split('T')[0]
    console.log(data)
    const fetchConfig = {
      method: "post",
      headers: {
        "Content-type": "application/json",
        "Authentication": token,
      },
      body: JSON.stringify(data)
    }
    const response = await fetch("http://192.168.86.105:8000/users/list_caffeine", fetchConfig);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setAmount(0);
      setCaffeine(0);
      setMeasurement(null);
      dropdownController.current.clear();
      Alert.alert('Intake added', '', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
  
    } else {
      console.log("Post failed");
    }
  }

  if (fontsLoaded) {
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
          <AutocompleteDropdown containerStyle={styles.dropdown}
            controller={controller => {dropdownController.current = controller}}
            clearOnFocus={false}
            closeOnBlur={false}
            closeOnSubmit={false}
            onSelectItem={onChangeDrink}
            dataSet={caffeineContent}
          />
          <Text style={styles.baseText}>How much?</Text>
          <View style={open? styles.howMuchOpen : styles.howMuchClosed}>
          <TextInput style={styles.input} returnKeyType={ 'done' } editable={drink && measurement ? true :false} onChangeText={onChangeAmount} keyboardType="numeric" value={amount} placeholder='Amount'></TextInput>
          <DropDownPicker
            open={open}
            value={measurement}
            items={items}
            setOpen={setOpen}
            setValue={setMeasurement}
            setItems={setItems}
            containerStyle={{width: '45%'}}
            style={{borderWidth:0}}
            placeholder='Unit of measurement'
          />
          </View>
          <Text style={styles.baseText}>You have consumed {parseInt(caffeine)} mg of caffeine.</Text>
          <Pressable style={styles.addButton} onPress={() => {addIntake()}} onPressIn={() => {}} onPressOut={() => {}}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        </ImageBackground>
        <Footer />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
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
  howMuch: {
    flex: 1,
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    textAlign: "center"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    color: 'black',
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth:0,
    width: '45%',
    padding: 10
  },
  dropdown: {
    marginTop: 10,
  },
  howMuchOpen: {
    zIndex: 100,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  howMuchClosed: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addButtonText: {
    textAlign: 'center',
    padding: 10,
    marginTop: 10,
    borderColor: "rgba(242, 255, 99, 1)",
    borderWidth: 2,
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
    color: "rgba(242, 255, 99, 1)",
    borderRadius: 4,
  },
  addButton: {
    alignItems: 'center'
  }
});
