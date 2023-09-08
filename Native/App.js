import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen"
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import MyAppText, {MyAppHeaderText} from './MyAppText';

export default function App() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic
  });

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
    <View style={styles.container}>
      <MyAppHeaderText text={`Caffreedom${'\n'}`}></MyAppHeaderText>
      <MyAppText text="Thank you for choosing us to help you on your journey..." />
      <StatusBar style="auto" />
    </View>
  );
} else {
  return null;
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
