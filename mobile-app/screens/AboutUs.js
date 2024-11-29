import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

// Define theme
const theme = {
  colors: {
    background: "#f7f5ed", // Light cream
    headerText: "#213d30", // Forest green
    sectionTitle: "#8cab68", // Olive green
    bodyText: "#555", // Subtle gray
    cardBackground: "#ffffff", // White
    cardBorder: "#ddd", // Light gray border
  },
  fonts: {
    title: "DynaPuff-Bold",
    body: "FuzzyBubbles-Regular",
  },
};

export default function AboutUs() {
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
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          About the Orangutan Oasis Sanctuary
        </Text>
        <Text style={styles.headerSubtitle}>
          Learn more about our mission and the amazing team working to protect
          endangered wildlife.
        </Text>
      </View>

      {/* Meet Our Team Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meet Our Team</Text>
        <Image
          source={require("../assets/team-photo.jpg")} // Add team.jpg to the assets folder
          style={styles.teamImage}
        />
        <Text style={styles.sectionContent}>
          The dedicated team at the Orangutan Oasis Sanctuary is committed to
          protecting endangered wildlife, preserving their natural habitats, and
          spreading awareness about the importance of conservation. Our team
          works tirelessly to make a difference.
        </Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionContent}>
          Our mission is to rehabilitate and protect endangered orangutans and
          other wildlife species. We aim to preserve the rainforest ecosystem
          and promote sustainable practices that benefit both animals and local
          communities.
        </Text>
      </View>

      {/* Core Values Section */}
      <View style={styles.coreValuesContainer}>
        <Text style={styles.coreValuesTitle}>Our Core Values</Text>
        <View style={styles.coreValueCard}>
          <Text style={styles.coreValueTitle}>Conservation</Text>
          <Text style={styles.coreValueContent}>
            We believe in preserving the natural habitats of endangered species
            and promoting sustainable practices.
          </Text>
        </View>
        <View style={styles.coreValueCard}>
          <Text style={styles.coreValueTitle}>Education</Text>
          <Text style={styles.coreValueContent}>
            We educate the public and local communities about the importance of
            protecting wildlife and their ecosystems.
          </Text>
        </View>
        <View style={styles.coreValueCard}>
          <Text style={styles.coreValueTitle}>Community</Text>
          <Text style={styles.coreValueContent}>
            We work closely with local communities to create a shared
            responsibility for the protection of wildlife.
          </Text>
        </View>
      </View>

      {/* Contact Information */}
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
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.title,
    color: theme.colors.headerText,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    textAlign: "center",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.title,
    color: theme.colors.sectionTitle,
    marginBottom: 10,
  },
  teamImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    lineHeight: 22,
  },
  coreValuesContainer: {
    marginBottom: 20,
  },
  coreValuesTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.title,
    color: theme.colors.headerText,
    marginBottom: 15,
    textAlign: "center",
  },
  coreValueCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: 10,
  },
  coreValueTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.title,
    color: theme.colors.sectionTitle,
  },
  coreValueContent: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.bodyText,
    marginTop: 5,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.title,
    color: theme.colors.headerText,
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
    marginTop: 5,
  },
});
