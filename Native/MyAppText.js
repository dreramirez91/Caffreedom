import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";

export default function MyAppText({text}) {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic
  });

  if (fontsLoaded) {
    return (
      <Text style={styles.myAppText}>{text}</Text>
  );
} else {
  return null;
}
}

export function MyAppHeaderText({text}) {
    let [fontsLoaded] = useFonts({
      Lora_400Regular_Italic
    });
  
    if (fontsLoaded) {
      return (
        <Text style={styles.myAppHeaderText}>{text}</Text>
    );
  } else {
    return null;
  }
  }

const styles = StyleSheet.create({
    myAppText: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Lora_400Regular_Italic',
    fontSize: 18,
    textAlign: 'center'
  },
  myAppHeaderText: {
    backgroundColor: 'white',
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Lora_400Regular_Italic',
    fontSize: 20,
    textAlign: 'center'
  },
});