import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import TMDBService from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
const tmdbService = new TMDBService();

const Family = () => {
  const [data, setData] = useState({
    popularFamily: [],
    indianFamily: [],
    animatedFamily: [],
    familyDrama: [],
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularFamily, animatedFamily, indianFamily, familyDrama] =
          await Promise.all([
            // 🌟 Popular Family Movies
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=10751&sort_by=popularity.desc&page=1"
            ),

            // 🌟 Animated + Family
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=16,10751&sort_by=popularity.desc&page=1"
            ),

            // 🌟 Indian Family Movies
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=10751&region=IN&sort_by=popularity.desc&language=hi-IN&page=1"
            ),

            // 🌟 Family War/Drama Movies
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=10752&language=en-US&sort_by=popularity.desc"
            ),
          ]);

        setData({
          popularFamily: popularFamily.results,
          animatedFamily: animatedFamily.results,
          indianFamily: indianFamily.results,
          familyDrama: familyDrama.results,
        });
      } catch (err) {
        console.error("Error loading family movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  const renderContent = () => (
    <>
      <TrendingMovies data={data.popularFamily} />
      <MovieList title="Animated Family Movies" data={data.animatedFamily} />
      <MovieList title="Indian Family Movies" data={data.indianFamily} />
      <MovieList title="Family War & Drama" data={data.familyDrama} />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"></StatusBar>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>A</Text>
          <Text style={{ color: "white" }}>nimated</Text>
          <Text style={{ color: "#FF007F" }}> M</Text>
          <Text style={{ color: "white" }}>ovies</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF007F" />
        </View>
      ) : (
        <FlatList
          data={[1]}
          keyExtractor={() => "main-list"}
          renderItem={null}
          ListHeaderComponent={renderContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingTop:30  
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    paddingTop: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Family;
