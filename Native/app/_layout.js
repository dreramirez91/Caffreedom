// This file is used to add providers, such as Redux, into the app, which can be accessed by any route in the app.
// Compare App.js in traditional React Native projects
import { useCallback, useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import Footer from "../components/Footer";
import background from "../assets/background.jpeg";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ImageBackground, StyleSheet } from "react-native";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { PaperProvider } from "react-native-paper";

import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";

// SplashScreen.preventAutoHideAsync();

export default function appLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lora_400Regular_Italic,
    Quicksand_300Light,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground source={background} resizeMode="cover" style={styles.image}>
          <Slot />
        </ImageBackground>
        <Footer />
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
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
});
