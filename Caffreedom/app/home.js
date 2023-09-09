import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import * as SplashScreen from "expo-splash-screen"
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from '../assets/background.jpeg';

export default function Home() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic
  });

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
    <View style={styles.container}>
      <ImageBackground source={background} resizeMode='cover' style={styles.image}>
      <Text style={styles.home}>Caffreedom{'\n\n'}Thank you for choosing us to help you on your journey...</Text>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
} else {
  return null;
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineStyle: {
    borderBottomStyle: 'solid',
    borderColor: 'black',
    margin:10
  },
  home: {
    backgroundColor: 'white',
    width: '100%',
    fontFamily: 'Lora_400Regular_Italic',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
});
