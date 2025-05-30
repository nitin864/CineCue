import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "react-native-vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MovieList from "../components/MovieList";
import { useRoute } from "@react-navigation/native";
import TMDBService from "../utils/api"; //

const { width, height } = Dimensions.get("window");

const PersonScreen = () => {
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [person, setPerson] = useState(null);
  const [personMovies, setPersonMovies] = useState([]);
  const { params: item } = useRoute(); // item.id is the person's ID
  const tmdbService = new TMDBService();
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const personDetails = await tmdbService.fetchFromTMDB(
        `/person/${item.id}`
      );
      setPerson(personDetails);

      const movies = await tmdbService.fetchFromTMDB(
        `/person/${item.id}/movie_credits`
      );
      setPersonMovies(movies.cast); // You can sort/filter if needed
    };

    fetchData();
  }, [item]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Entypo name="chevron-left" size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavourite(!isFavourite)}
        >
          <Ionicons
            name={isFavourite ? "heart" : "heart-outline"}
            size={30}
            color={isFavourite ? "#FF007F" : "white"}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.personimgContainer}>
        {imageLoading && (
          <ActivityIndicator
            size="large"
            color="#FFD700"
            style={styles.imageLoader}
          />
        )}
        <Image
          style={styles.personImage}
          source={
            person?.profile_path
              ? { uri: `https://image.tmdb.org/t/p/w500${person.profile_path}` }
              : require("../assets/images/nodp.png")
          }
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={styles.personName}>{person?.name}</Text>
        <Text style={styles.locationText}>{person?.place_of_birth}</Text>
      </View>

      <View style={styles.infoContainer}>
        {[
          { title: "Gender", value: person?.gender === 2 ? "Male" : "Female" },
          { title: "Birthday", value: `${person?.birthday || "-"}` },
          {
            title: "Known for",
            value: `${person?.known_for_department || "-"}`,
          },
          { title: "Popularity", value: `${person?.popularity?.toFixed(2)} %` },
        ].map((item, index) => (
          <View
            key={index}
            style={[
              styles.infoBox,
              index !== 3 && styles.infoBoxBorder, // Add border to all except last
            ]}
          >
            <Text style={styles.infoTitle}>{item.title}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginVertical: 6, marginHorizontal: 4 }}>
        <Text
          style={{
            color: "white",
            fontSize: 19,
            paddingTop: 10,
            marginHorizontal: 15,
            paddingBottom: 7,
          }}
        >
          Biography{" "}
        </Text>
        <Text
          style={{
            color: "grey",
            fontSize: 13,
            justifyContent: "center",
            marginHorizontal: 15,
          }}
        >
          {person?.biography || "No biography available."}
        </Text>
      </View>

      <MovieList
        title={"Acted in Movies"}
        hideSeeAll={true}
        data={personMovies}
      />
    </ScrollView>
  );
};

export default PersonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e", // Tailwind: bg-neutral-900
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF007F",
    padding: 10,
    borderRadius: 12,
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heartButton: {
    marginTop: 10,
    marginRight: 20,
  },
  personimgContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 35,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  personImage: {
    height: 250,
    width: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: "grey",
  },
  personName: {
    color: "white",
    fontWeight: "600",
    fontSize: 28,
  },
  locationText: {
    color: "#737373",
    fontWeight: "300",
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#404040", // Tailwind: bg-neutral-700
    borderRadius: 50,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  infoBox: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  infoBoxBorder: {
    borderRightWidth: 1,
    borderRightColor: "#737373", // Tailwind: neutral-500
  },
  infoTitle: {
    color: "white",
    fontWeight: "500",
  },
  infoValue: {
    color: "#d4d4d4",
    fontWeight: "300",
    fontSize: 12,
  },
  imageLoader: {
    position: "absolute",
    zIndex: 1,
  },
});
