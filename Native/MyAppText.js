import { StyleSheet, Text, View } from "react-native";
import { useFonts, Cormorant_400Regular } from "@expo-google-fonts/lora";

export default function MyAppText({ text }) {
  let [fontsLoaded] = useFonts({
    Cormorant_400Regular,
  });

  if (fontsLoaded) {
    return <Text style={styles.myAppText}>{text}</Text>;
  } else {
    return null;
  }
}

export function MyAppHeaderText({ text }) {
  let [fontsLoaded] = useFonts({
    Cormorant_400Regular,
  });

  if (fontsLoaded) {
    return <Text style={styles.myAppHeaderText}>{text}</Text>;
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  myAppText: {
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Cormorant_400Regular",
    fontSize: 18,
    textAlign: "center",
  },
  myAppHeaderText: {
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Cormorant_400Regular",
    fontSize: 20,
    textAlign: "center",
  },
});
