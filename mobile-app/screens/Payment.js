import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    titleText: "#213d30", // Forest green
    descriptionText: "#555", // Subtle gray
    buttonBackground: "#1B95E0", // Bright blue
    buttonText: "#f7f5ed", // Light cream
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function Payment() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Donation</Text>
      <Text style={styles.description}>
        Please choose your preferred payment method to complete your donation.
      </Text>

      {/* Simulate different payment options */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Pay via Credit/Debit Card")}
      >
        <Text style={styles.buttonText}>Pay with Credit/Debit Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Pay via PayPal")}
      >
        <Text style={styles.buttonText}>Pay with PayPal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Pay via Bank Transfer")}
      >
        <Text style={styles.buttonText}>Pay via Bank Transfer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  description: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.descriptionText,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
});
