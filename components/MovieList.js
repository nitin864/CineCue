import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const MovieList = ({ title, data, hideSeeAll }) => {
  //const moviename = "Ant-Man and the Wasp: Quantumania";
  const navigation = useNavigation();

  return (
    <View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.maintext}>{title}</Text>

        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scroll for Movies */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {Array.isArray(data) &&
          data.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View style={styles.movieContainer}>
                <Image
                  source={
                    item.poster_path
                      ? {
                          uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                        }
                      : require("../assets/images/no.png")
                  }
                  style={styles.images}
                />

                <Text style={styles.movieTitle}>{item.title}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maintext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  text: {
    color: "#FF007F",
    fontSize: 17,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1c1c1c",
  },
  movieContainer: {
    marginRight: 16,
    alignItems: "center",
    width: width * 0.33,
  },
  images: {
    width: width * 0.33,
    height: height * 0.22,
    borderRadius: 25,
    marginBottom: 4,
  },
  movieTitle: {
    color: "gray",
    fontSize: 12,
    textAlign: "center",
  },
});

export default MovieList;
