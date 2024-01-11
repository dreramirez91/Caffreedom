import { useCallback, createContext, useState, useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import Footer from "../components/Footer";
import background from "../assets/background.jpeg";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ImageBackground, StyleSheet, Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useFonts, CrimsonPro_400Regular, CrimsonPro_600SemiBold, CrimsonPro_400Regular_Italic } from "@expo-google-fonts/crimson-pro";
import * as SecureStore from "expo-secure-store";
export const UserContext = createContext(null);

export default function appLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CrimsonPro_400Regular,
    CrimsonPro_600SemiBold,
    CrimsonPro_400Regular_Italic,
  });
  const [token, setToken] = useState(null);

  async function fetchToken(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log(result);
      setToken(result);
    } else {
      console.log("Could not retrieve token from store");
    }
  }

  useEffect(() => {
    fetchToken("token");
    console.log("fdajfkdaj");
  }, [<Slot />]);
  // how to update state since layout is only called once
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
          <UserContext.Provider value={token}>
            <Slot />
          </UserContext.Provider>
        </ImageBackground>
        <Footer />
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
    //{" "}
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
