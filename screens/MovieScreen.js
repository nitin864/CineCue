import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Text,
  Linking,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "react-native-vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import Cast from "../components/Cast";
import MovieList from "../components/MovieList";
import TMDBService from "../utils/api";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";

const tmdbService = new TMDBService();

export default function MovieScreen() {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const navigation = useNavigation();
  const [cast, setCast] = useState([]);
  const [similarData, setSimilarMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [loadingTrailer, setLoadingTrailer] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await tmdbService.fetchMovieDetails(item.id);
        setMovieDetails(details);

        const similarData = await tmdbService.fetchSimilarMovies(item.id);
        setSimilarMovies(similarData.results);

        const castData = await tmdbService.fetchFromTMDB(
          `/movie/${item.id}/credits`
        );
        setCast(castData.cast);

        const trailerRes = await tmdbService.fetchFromTMDB(
          `/movie/${item.id}/videos`
        );
        const trailer = trailerRes.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoadingSimilar(false);
        setLoadingTrailer(false); // <-- here
      }
    };
    fetchData();
  }, [item]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.poster_path
              ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }
              : require("../assets/images/no.png")
          }
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "#1e1e1e"]}
          style={styles.linearGradient}
        />

        {/* Floating Buttons over Image */}
        <SafeAreaView style={styles.floatingButtons}>
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
              name="heart"
              size={30}
              color={isFavourite ? "#FF007F" : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Movie Details */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{movieDetails.title}</Text>
        <Text style={styles.tiletxt2}>
          {movieDetails.status} •{" "}
          {movieDetails.release_date?.split("-")[0] || "N/A"} •{" "}
          {movieDetails.runtime} min
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={{ color: "white", marginLeft: 5, fontSize: 16 }}>
            {movieDetails.vote_average?.toFixed(1) || "N/A"}/10
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Array.isArray(movieDetails.genres) &&
            movieDetails.genres.map((genre, index) => (
              <Text key={index} style={styles.tiletxt2}>
                {genre.name}
                {index !== movieDetails.genres.length - 1 ? " • " : ""}
              </Text>
            ))}
        </View>
        <Text style={styles.tiletxt2}>{movieDetails.overview}</Text>
      </View>
      {/* Trailer Section */}
      <View style={{ padding: 10,borderRadius:5 ,borderBlockColor:4}}>
        <Text
          style={{
            color: "lightgrey",
            fontSize: 18,
            fontFamily: "sans-serif",
            fontWeight: "800",
            paddingVertical: 4,
            marginBottom:5
          }}
        >
          Trailer
        </Text>
        {loadingTrailer ? (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <ActivityIndicator size="large" color="#FF007F" />
            <Text style={{ color: "gray", marginTop: 10 }}>
              Loading trailer...
            </Text>
          </View>
        ) : trailerKey ? (
          <YoutubePlayer height={230} play={false} videoId={trailerKey} />
        ) : (
          <Text
            style={{
              color: "gray",
              fontSize: 16,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            🚫 No Trailer Available
          </Text>
        )}
      </View>
      <Cast navigation={navigation} cast={cast} />
      {loadingSimilar ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF007F" />
          <Text style={{ color: "gray", marginTop: 10 }}>
            Loading similar movies...
          </Text>
        </View>
      ) : similarData && similarData.length > 0 ? (
        <MovieList
          title="Similar Movies"
          hideSeeAll={true}
          data={similarData}
        />
      ) : (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "gray", fontSize: 16 }}>
            No similar movies found.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  safeArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF007F",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
     
    marginLeft: 5,
  },
  heartButton: {
    marginTop:4,
    marginRight: 5,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  titleContainer: {
    
    alignItems: "center",
     
  },
  titleText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  tiletxt2: {
    color: "grey",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  trailerButton: {
    backgroundColor: "#FF007F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  trailerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  noTrailerText: {
    color: "gray",
    fontSize: 16,
    marginTop: 10,
  },
  noTrailerText: {
    color: "gray",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 400, // Adjust this for how tall you want the fade
 
  },
  floatingButtons: {
    position: "absolute",
    top: ios ? 40 : 20, // offset depending on platform
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
