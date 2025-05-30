import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const HomeCast = ({ cast, navigation }) => {
  // For demonstration purposes we use constant names.

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Top Actors</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castContainer}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.castCard}
                onPress={() => navigation.navigate("Person", person)}
              >
                <Image
                  style={styles.card}
                  source={
                    person?.profile_path
                      ? {
                          uri: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
                        }
                      : require("../assets/images/nodp.png") // your local fallback image
                  }
                />

                <Text style={styles.nameText}>
                  {`${person.name}`.length > 10
                    ? `${person.name}`.slice(0, 10) + "..."
                    : `${person.name}`}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default HomeCast;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  headerText: {
    color: "white",
    paddingVertical: 9,
    paddingHorizontal: 8,
    fontSize: 17,
    fontWeight: "bold",
  },
  castContainer: {
    paddingHorizontal: 15,
  },
  castCard: {
    backgroundColor: "#2c2c2c", // Dark background for contrast
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 100,
    alignItems: "center",
  },
  characterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  nameText: {
    color: "white",
    fontSize: 12,

    textAlign: "center",
    fontWeight: "200",
    textAlign: "center",
  },
  card: {
    borderRadius: 60,
    height: 80,
    width: 80,
  },
});
