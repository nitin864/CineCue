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

const AnimeScreen = () => {
  const [data, setData] = useState({
    trending: [],
    toprated1: [],
    upcoming: [],
    popular: [],
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const openDrawer = () => {
    navigation.openDrawer(); // ✅ now this will work
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, toprated1, upcoming, popular] = await Promise.all([
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=16&with_original_language=ja&language=en-US&sort_by=popularity.desc"
          ),
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&&vote_count.gte=100&with_genres=16&with_original_language=ja&language=en-US&sort_by=vote_average.desc"
          ),
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&language=en-US&with_genres=16&with_original_language=ja&sort_by=primary_release_date.asc&primary_release_date.gte=2025-04-18"
          ),
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=16,18&with_original_language=ja&sort_by=popularity.desc"
          ),
        ]);

        setData({
          trending: trending.results,

          toprated1: toprated1.results,
          upcoming: upcoming.results,
          popular: popular.results,
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
      <MovieList title="Upcoming" data={data.upcoming} />
      <MovieList title="Top Rated" data={data.toprated1} />
      <MovieList title="Drama" data={data.popular} />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"></StatusBar>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>A</Text>
          <Text style={{ color: "white" }}>nime</Text>
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

export default AnimeScreen;
