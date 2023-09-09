// export default function Page() {
//   return <View><Link href="/home">Home</Link></View>;
// }

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import background from "../assets/background.jpeg";
import { Link } from "expo-router";

export default function Home() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  const Separator = () => <View style={styles.separator} />;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <View style={styles.container}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.home}>
            <Text style={styles.headerText}>Caffreedom</Text>
          </View>
          <View style={styles.user}>
            <Pressable onPress={() => null}>
              <Text style={styles.pressableText}>Login</Text>
            </Pressable>
            <Pressable onPress={() => null}>
              <Text style={styles.pressableText}>Sign-up</Text>
            </Pressable>
          </View>
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
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  home: {
    backgroundColor: "rgba(157, 108, 255, 0.75)",
    width: "100%",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    flexDirection: "row",
  },
  headerText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 24,
    textAlign: "center",
  },
  user: {
    backgroundColor: "rgba(157, 108, 255, 0.75)",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingBottom: 10,
  },
  pressableText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 20,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "black",
    bottomBorderWidth: StyleSheet.hairlineWidth,
  },
});
