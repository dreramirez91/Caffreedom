import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { List } from "react-native-paper";

export default function Info() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

  return (
    <ScrollView style={styles.infoContainer}>
      <List.Section titleStyle={styles.sectionTitle} title="About Us">
        <List.Accordion titleStyle={styles.accordianTitle} title="About Caffreedom" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
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
        <List.Accordion titleStyle={styles.accordianTitle} title="Privacy Policy" left={(props) => <List.Icon {...props} icon="" />} expanded={expanded} onPress={handlePress}>
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
              </>
            }
          />
        </List.Accordion>
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
  subSectionHeader: { fontFamily: "CrimsonPro_600SemiBold", fontSize: 22, textDecorationLine: "underline" },
  accordianTitle: { fontSize: 24, fontFamily: "CrimsonPro_400Regular", color: "rgba(157, 108, 255, 1)" },
  description: { fontSize: 18, fontFamily: "CrimsonPro_400Regular", color: "rgba(242, 255, 99, 1)" },
});
