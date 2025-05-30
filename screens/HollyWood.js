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

const HollyWood = () => {
  const [data, setData] = useState({
    trending: [],
    action: [],
    toprated: [],
    war: [],
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
        const [trending, action, toprated, war] = await Promise.all([
          tmdbService.fetchFromTMDB(
            "/trending/movie/day?api_key=c46ca2b4791f4cf722454d2be403d2ac&language=en-US"
          ),
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=28&language=en-US&sort_by=popularity.desc"
          ),
          tmdbService.fetchFromTMDB(
            "/movie/top_rated?api_key=c46ca2b4791f4cf722454d2be403d2ac&language=en-US&page=1"
          ),
          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=10752&language=en-US&sort_by=popularity.desc"
          ),
        ]);

        setData({
          trending: trending.results,
          action: action.results,
          toprated: toprated.results,
          war: war.results,
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

      <MovieList title="Action" data={data.action} />
      <MovieList title="Top Rated" data={data.toprated} />
      <MovieList title="War" data={data.war} />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"></StatusBar>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>H</Text>
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

export default HollyWood;
