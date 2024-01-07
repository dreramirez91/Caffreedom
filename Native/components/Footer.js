import React from "react";
import { StyleSheet, View } from "react-native";
import { useFonts, Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { MaterialCommunityIcons, Octicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Footer() {
  let [fontsLoaded] = useFonts({
    Lora_400Regular_Italic,
  });

  if (fontsLoaded) {
    return (
      <View style={styles.footerContainer}>
        <Link href="/home">
          <MaterialCommunityIcons name="home-outline" size={32} color="rgba(242, 255, 99, 1)" />
        </Link>
        <Link href="/calculator">
          <AntDesign name="calculator" size={32} color="rgba(242, 255, 99, 1)" />
        </Link>
        <Link href="/table">
          <FontAwesome name="table" size={32} color="rgba(242, 255, 99, 1)" />
        </Link>
        <Link href="/graph">
          <Octicons name="graph" size={32} color="rgba(242, 255, 99, 1)" />
        </Link>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    bottom: 0,
    position: "fixed",
    backgroundColor: "rgba(157, 108, 255, 0.70)",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 4,
    paddingBottom: 2,
    borderTopWidth: 2,
    borderColor: "rgba(94, 25, 121, 1)",
  },
});
