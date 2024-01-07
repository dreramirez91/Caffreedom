import { useCallback, useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import Footer from "../components/Footer";
import background from "../assets/background.jpeg";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ImageBackground, StyleSheet, Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useFonts, CrimsonPro_400Regular } from "@expo-google-fonts/crimson-pro";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function appLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CrimsonPro_400Regular,
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
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
