import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, List } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { useRouter, useFocusEffect } from "expo-router";

export default function Info() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);
  const router = useRouter();

  async function deleteUser(key) {
    console.log("SUP");
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const fetchConfig = {
          method: "delete",
          headers: {
            "Content-type": "application/json",
            Authorization: result,
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(`${apiUrl}/users/delete/`, fetchConfig);
        if (response.ok) {
          const data = await response.json();
          console.log("data");
          router.replace("/home");
          return;
        } else {
          console.log("Delete failed");
        }
      } else {
        console.log("Could not retrieve token from store for delete request");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView style={styles.infoContainer}>
      <List.Section titleStyle={styles.sectionTitle} title="About Us">
        <List.AccordionGroup>
          <List.Accordion id="1" titleStyle={styles.accordianTitle} title="About Caffreedom" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
            <List.Item
              descriptionNumberOfLines={99}
              descriptionStyle={styles.description}
              description={
                <>
                  Caffreedom is a caffeine intake tracker designed to help users monitor and manage their caffeine consumption. Our app allows users to record their beverage intake, including types of drinks and their respective caffeine content.{"\n\n"}
                  <Text style={styles.subSectionHeader}>Acknowledgment</Text>
                  {"\n\n"}We gratefully acknowledge the use of caffeine content information provided by Caffeine Informer (https://www.caffeineinformer.com/) to facilitate accurate tracking within our app.{"\n\n"}
                  Caffreedom is committed to safeguarding user privacy and ensuring a seamless caffeine intake tracking experience.{"\n"}
                </>
              }
            />
          </List.Accordion>
          <List.Accordion id="2" titleStyle={styles.accordianTitle} title="Privacy Policy" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
            <List.Item
              descriptionNumberOfLines={99}
              descriptionStyle={styles.description}
              description={
                <>
                  <Text style={styles.subSectionHeader}>Privacy Policy for Caffreedom</Text>
                  {"\n\n"}This Privacy Policy governs the manner in which Caffreedom collects, uses, maintains, and discloses information collected from users of the Caffreedom mobile application.{"\n\n"}
                  <Text style={styles.subSectionHeader}>Information Collection and Use</Text>
                  {"\n\n"}Caffreedom collects and uses personal information for the sole purpose of providing a caffeine intake tracking service. The only information collected is user-provided data: When creating an account, users may input their caffeine intake details, such as beverage types, intake dates, and caffeine content.{"\n\n"}
                  <Text style={styles.subSectionHeader}>Data Sharing and Security</Text>
                  {"\n\n"}
                  Caffreedom does not share any user data with third parties. All user-provided information is securely stored and used exclusively for the intended purpose of tracking caffeine intake.
                  {"\n\n"}
                  <Text style={styles.subSectionHeader}>Data Accuracy</Text>
                  {"\n\n"}
                  Caffreedom utilizes caffeine content information from Caffeine Informer (https://www.caffeineinformer.com/) for accurate tracking of caffeine intake. Users' reliance on this data is subject to the accuracy of the source.
                  {"\n\n"}
                  <Text style={styles.subSectionHeader}>Third-Party Links</Text>
                  {"\n\n"}
                  Caffreedom may contain links to external sites, including the Caffeine Informer website. Users are encouraged to review the privacy policies of these external sites, as Caffreedom holds no responsibility for the content and practices of these sites.
                  {"\n\n"}
                  <Text style={styles.subSectionHeader}>Changes to This Privacy Policy</Text>
                  {"\n\n"}
                  Caffreedom reserves the right to update this privacy policy at any time. Users will be notified of any changes by revising the "last updated" date at the bottom of this page.
                  {"\n\n"}
                  <Text style={styles.subSectionHeader}>Contact Information</Text>
                  {"\n\n"}
                  If you have any questions or concerns about this Privacy Policy, please contact us at caffreedom@gmail.com.
                  {"\n\n"}
                  <Text style={styles.lastUpdated}>Last Updated: January 9th, 2024</Text>
                </>
              }
            />
          </List.Accordion>
        </List.AccordionGroup>
      </List.Section>
      <List.Section titleStyle={styles.sectionTitle} title="About You">
        <List.AccordionGroup>
          <List.Accordion id="1" titleStyle={styles.accordianTitle} title="Delete your account" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
            <List.Item
              descriptionNumberOfLines={99}
              description={
                <>
                  <Button onPress={() => deleteUser("token")}>
                    <Text style={styles.deleteYourAccount}>Click here to delete your account and all of its associated records.</Text>
                  </Button>
                </>
              }
            />
          </List.Accordion>
        </List.AccordionGroup>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    backgroundColor: "rgba(157, 108, 255, 0.7)",
    width: "100%",
    borderRadius: 4,
  },
  sectionTitle: { fontSize: 30, fontFamily: "CrimsonPro_400Regular", color: "rgba(242, 255, 99, 1)" },
  subSectionHeader: { fontFamily: "CrimsonPro_600SemiBold", fontSize: 22, textDecorationLine: "underline", color: "rgba(242, 255, 99, 1)" },
  lastUpdated: { fontFamily: "CrimsonPro_400Regular_Italic", fontSize: 18 },
  accordianTitle: { fontSize: 24, fontFamily: "CrimsonPro_400Regular", color: "rgba(157, 108, 255, 1)" },
  description: { fontSize: 18, fontFamily: "CrimsonPro_400Regular", color: "rgba(242, 255, 99, 1)" },
  deleteYourAccount: {
    color: "rgba(255, 99, 99, 1)",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 22,
  },
});
