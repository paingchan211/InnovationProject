import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#213d30", // Forest green
    sectionTitle: "#8cab68", // Olive green
    bodyText: "#555", // Subtle gray
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function Info() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visitor Information</Text>

      {/* Opening Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        <Text style={styles.sectionContent}>
          Monday to Sunday: 9:00 AM - 5:00 PM{"\n"}
          Closed on public holidays.
        </Text>
      </View>

      {/* Ticket Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ticket Pricing</Text>
        <Text style={styles.sectionContent}>
          Adults: $10.00{"\n"}
          Children (Under 12): $5.00{"\n"}
          Students & Senior Citizens: $7.00
        </Text>
      </View>

      {/* Guidelines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visitor Guidelines</Text>
        <Text style={styles.sectionContent}>
          - Stay on marked trails.{"\n"}- Respect the wildlife. Do not feed or
          disturb the animals.{"\n"}- Use designated viewing platforms for
          wildlife observation.{"\n"}- Photography is allowed but avoid using
          flash.
        </Text>
      </View>

      {/* Map and Facilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map & Facilities</Text>
        <Text style={styles.sectionContent}>
          - Restrooms are available at the entrance and near the visitor center.
          {"\n"}- A café is located near the visitor center for refreshments.
          {"\n"}- Guided tours are available daily at 10:00 AM and 2:00 PM.
        </Text>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionContent}>
          Q: What is the best time to visit the reserve?{"\n"}
          A: Early morning or late afternoon is ideal for wildlife sightings.
          {"\n\n"}
          Q: Are there any special events?{"\n"}
          A: Check the calendar for special guided tours and conservation talks.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.title,
    color: theme.colors.sectionTitle,
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    lineHeight: 22,
  },
});
