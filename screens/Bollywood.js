import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
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

const Bollywood = () => {
  const [data, setData] = useState({
    trending: [],
    old: [],
    comedyBollywood: [],
    newBollywood: [],
    horror: [],
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const openDrawer = () => {
    navigation.openDrawer();  
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, old, comedyBollywood, newBollywood, horror] =
          await Promise.all([
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=hi&region=IN&sort_by=popularity.desc"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=hi&region=IN&sort_by=popularity.desc&primary_release_date.lte=2000-12-31&vote_count.gte=10"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=35&with_original_language=hi&region=IN&sort_by=popularity.desc&vote_count.gte=10"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=hi&region=IN&primary_release_year=${currentYear}&sort_by=popularity.desc"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=hi&with_genres=27&sort_by=popularity.desc&region=IN"
            ),
          ]);

        setData({
          trending: trending.results,
          old: old.results,
          comedyBollywood: comedyBollywood.results,
          newBollywood: newBollywood.results,
          horror: horror.results,
        });
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 3600000); // Fetch every 1 hour

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const renderContent = () => (
    <>
      <TrendingMovies data={data.trending} />

      <MovieList title="90's Hits" data={data.old} />
      <MovieList title="Comedy" data={data.comedyBollywood} />
      <MovieList
        title={`Bollywood ${new Date().getFullYear()}`}
        data={data.newBollywood}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"></StatusBar>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>B</Text>
          <Text style={{ color: "white" }}>olly</Text>
          <Text style={{ color: "#FF007F" }}>W</Text>
          <Text style={{ color: "white" }}>ood</Text>
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
          data={[1]} // dummy single item to render header content
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

export default Bollywood;
