import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    buttonBackground: "#213d30", // Forest green
    buttonText: "#f7f5ed", // Light cream
    inputBorder: "#ccc", // Light gray for input borders
    sectionTitle: "#8cab68", // Olive green
    bodyText: "#555", // Subtle gray for text
    linkText: "#1B95E0", // Bright blue for links
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function Donation({ navigation }) {
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleDonation = () => {
    alert(`Thank you for your donation!`);
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:info@orangutanoasis.com");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleSocialMediaPress = (platform) => {
    let url = "";
    switch (platform) {
      case "Facebook":
        url = "https://www.facebook.com";
        break;
      case "Twitter":
        url = "https://www.twitter.com";
        break;
      case "Instagram":
        url = "https://www.instagram.com";
        break;
    }
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Support Our Conservation Efforts</Text>
      <Text style={styles.subtitle}>
        Your donation helps us protect endangered wildlife and preserve their
        habitats.
      </Text>

      {/* Donation Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Donation Amount</Text>
        <View style={styles.amountButtons}>
          {["$10", "$25", "$50", "$100"].map((amount, index) => (
            <TouchableOpacity key={index} style={styles.amountButton}>
              <Text style={styles.amountButtonText}>{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.orText}>Or Enter a Custom Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter custom amount"
          value={customAmount}
          onChangeText={setCustomAmount}
        />
      </View>

      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Your Payment Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on Card"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration Date (MM/YY)"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      {/* Donate Button */}
      <TouchableOpacity style={styles.donateButton} onPress={handleDonation}>
        <Text style={styles.donateButtonText}>Donate Now</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Contact Information</Text>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.footerText}>Email: info@orangutanoasis.com</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.footerText}>Phone: +123 456 7890</Text>
        </TouchableOpacity>

        <Text style={styles.footerTitle}>Social Media</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => handleSocialMediaPress("Facebook")}>
            <Text style={styles.footerText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress("Twitter")}>
            <Text style={styles.footerText}> | Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress("Instagram")}>
            <Text style={styles.footerText}> | Instagram</Text>
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
    fontSize: 26,
    fontFamily: theme.fonts.title,
    color: theme.colors.sectionTitle,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
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
    marginBottom: 10,
  },
  amountButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  amountButton: {
    backgroundColor: theme.colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    width: "22%",
    alignItems: "center",
  },
  amountButtonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.body,
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: theme.fonts.body,
    marginVertical: 10,
  },
  input: {
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    backgroundColor: "#fff",
  },
  donateButton: {
    backgroundColor: theme.colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  donateButtonText: {
    color: theme.colors.buttonText,
    fontFamily: theme.fonts.title,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.inputBorder,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.title,
    color: theme.colors.sectionTitle,
    marginTop: 10,
  },
  footerText: {
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
});
