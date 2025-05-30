import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Cast = ({ cast, navigation }) => {
  const isLoading = !cast || cast.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Top Cast</Text>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF007F" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.castContainer}
        >
          {cast.map((person, index) => {
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
                      : require("../assets/images/nodp.png")
                  }
                />
                <Text style={styles.characterText}>
                  {`${person?.character}`.length > 10
                    ? `${person.character}`.slice(0, 10) + "..."
                    : `${person.character}`}
                </Text>
                <Text style={styles.nameText}>
                  {`${person.name}`.length > 10
                    ? `${person.name}`.slice(0, 10) + "..."
                    : `${person.name}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default Cast;

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
    backgroundColor: "#2c2c2c",
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
    color: "grey",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  card: {
    borderRadius: 60,
    height: 80,
    width: 80,
  },
  loaderContainer: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
