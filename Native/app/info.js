import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Modal, Portal, List, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function Info() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [retrievedUsername, setRetrievedUsername] = useState("");
  const [enteredUsername, setEnteredUsername] = useState("");
  const [error, setError] = useState("");
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setEnteredUsername("");
    setError("");
    setVisible(false);
  };
  async function getUsername(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setLoggedIn(true);
      const fetchConfig = {
        method: "get",
        headers: {
          "Content-type": "application/json",
          Authorization: result,
        },
      };
      const response = await fetch(`${apiUrl}/users/`, fetchConfig);
      if (response.ok) {
        const data = await response.json();
        setRetrievedUsername(data.username);
      }
    } else {
      console.log("Could not retrieve token from store");
    }
  }

  useEffect(() => {
    getUsername("token");
  }, []);

  async function deleteUser(key) {
    try {
      const lowerUsername = enteredUsername.toLowerCase();
      confirmation = { username: lowerUsername };
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        const fetchConfig = {
          method: "delete",
          headers: {
            "Content-type": "application/json",
            Authorization: result,
          },
          body: JSON.stringify(confirmation),
        };
        const response = await fetch(`${apiUrl}/users/`, fetchConfig);
        const data = await response.json();
        if (response.ok) {
          SecureStore.deleteItemAsync("token");
          setLoggedIn(false);
          router.replace("/");
        } else {
          setError(data.Error);
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
      {loggedIn ? (
        <List.Section titleStyle={styles.sectionTitle} title="About You">
          <List.AccordionGroup>
            <List.Accordion id="1" titleStyle={styles.accordianTitle} title="Delete your account" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
              <List.Item
                descriptionNumberOfLines={99}
                description={
                  <>
                    <Pressable onPress={() => showModal(true)}>
                      <Text style={styles.deleteYourAccount}>Tap here to delete your account and all of its associated records.{"\n\n"}Note: Once deletion is confirmed it is impossible to recover your account.</Text>
                    </Pressable>
                    <View style={styles.centeredView}>
                      <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
                          <Text style={styles.modalHeader}>Are you sure?</Text>
                          <Text style={styles.modalBody}>Your username: {retrievedUsername}</Text>
                          <View>
                            <TextInput style={styles.input} onChangeText={setEnteredUsername} placeholder="Enter your username to confirm" value={enteredUsername}></TextInput>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                          </View>
                          <View style={styles.buttons}>
                            <Button onPress={() => deleteUser("token")} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                              Delete my Account
                            </Button>
                            <Button onPress={() => hideModal()} mode="contained" buttonColor="rgba(94, 65, 153, 1)">
                              Cancel
                            </Button>
                          </View>
                        </Modal>
                      </Portal>
                    </View>
                  </>
                }
              />
            </List.Accordion>
          </List.AccordionGroup>
        </List.Section>
      ) : null}
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
    backgroundColor: "rgba(157, 108, 255, 0.78)",
    width: "100%",
    borderRadius: 4,
  },
  sectionTitle: { fontSize: 30, fontFamily: "CrimsonPro_400Regular", color: "rgba(242, 255, 99, 1)" },
  subSectionHeader: { fontFamily: "CrimsonPro_600SemiBold", fontSize: 22, textDecorationLine: "underline", color: "rgba(242, 255, 99, 1)" },
  lastUpdated: { fontFamily: "CrimsonPro_400Regular_Italic", fontSize: 18 },
  accordianTitle: { fontSize: 24, fontFamily: "CrimsonPro_400Regular", color: "rgba(157, 108, 255, 1)" },
  description: { fontSize: 18, fontFamily: "CrimsonPro_400Regular", color: "rgba(242, 255, 99, 1)" },
  deleteYourAccount: {
    color: "rgba(242, 255, 99, 1)",

    fontFamily: "CrimsonPro_600SemiBold",
    fontSize: 22,
  },
  modalHeader: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular",
    fontSize: 22,
    padding: 10,
  },
  modalBody: {
    textAlign: "center",
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular_Italic",
    fontSize: 22,
    padding: 10,
  },
  input: {
    color: "black",
    fontFamily: "CrimsonPro_400Regular",
    borderRadius: 8,
    borderColor: "rgba(242, 255, 99, 1)",
    backgroundColor: "white",
    borderWidth: 1,
    padding: 10,
    margin: 10,
    fontSize: 18,
  },
  containerStyle: {
    margin: 20,
    backgroundColor: "rgba(157, 108, 255, 1)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },
  errorText: {
    color: "rgba(242, 255, 99, 1)",
    fontFamily: "CrimsonPro_400Regular_Italic",
    textAlign: "center",
    fontSize: 18,
    margin: 4,
  },
});
