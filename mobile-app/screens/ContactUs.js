import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    primaryButton: "#213d30", // Forest green
    buttonText: "#f7f5ed", // Light cream for button text
    border: "#ccc", // Border color for inputs
    inputBackground: "#fff", // Input background
    titleText: "#213d30", // Forest green for titles
    bodyText: "#555", // Subtle gray for text
    linkText: "#1B95E0", // Bright blue for links
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    alert(
      `Message Sent: \nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    );
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.subtitle}>
        We’d love to hear from you! Please fill out the form below and we’ll get
        in touch with you shortly.
      </Text>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        multiline
        numberOfLines={4}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      {/* Contact Information */}
      <View style={styles.contactInfo}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.sectionContent}>
          Email: info@orangutanoasis.com
        </Text>
        <Text style={styles.sectionContent}>Phone: +123 456 7890</Text>
        <Text style={styles.sectionContent}>
          Address: Semenggoh Nature Reserve, Borneo
        </Text>

        {/* Social Media Links */}
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => alert("Opening Facebook")}>
            <Text style={styles.socialMediaText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Opening Twitter")}>
            <Text style={styles.socialMediaText}> | Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Opening Instagram")}>
            <Text style={styles.socialMediaText}> | Instagram</Text>
          </TouchableOpacity>
        </View>
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
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    backgroundColor: theme.colors.inputBackground,
    marginBottom: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: theme.colors.primaryButton,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
  contactInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.title,
    color: theme.colors.titleText,
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    marginTop: 5,
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  socialMediaText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.linkText,
  },
});
