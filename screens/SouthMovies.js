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

const SouthMovies = () => {
  const [data, setData] = useState({
    trending: [],
    action: [],
    comedyBollywood: [],
    newBollywood: [],
    horror: [],
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
        const [trending, action, comedyBollywood, newBollywood, horror] =
          await Promise.all([
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=te&sort_by=popularity.desc&primary_release_date.gte=${fromDate}&primary_release_date.lte=${today}"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=ta&with_genres=28&sort_by=popularity.desc"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=ta&primary_release_date.gte=2025-04-17&sort_by=primary_release_date.asc"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=ta&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${year}-12-31&sort_by=primary_release_date.desc"
            ),
            tmdbService.fetchFromTMDB(
              "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_original_language=hi&with_genres=27&sort_by=popularity.desc&region=IN"
            ),
          ]);

        setData({
          trending: trending.results,
          action: action.results,
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

      <MovieList title="Action Blockbusters" data={data.action} />
      <MovieList title="Upcoming" data={data.comedyBollywood} />
      <MovieList
        title={`Released ${new Date().getFullYear()}`}
        data={data.newBollywood}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"></StatusBar>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>S</Text>
          <Text style={{ color: "white" }}>outh</Text>
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

export default SouthMovies;
