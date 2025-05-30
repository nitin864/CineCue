import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import TMDBService from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import HomeCast from "../components/HomeCast";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const tmdbService = new TMDBService();

const App = () => {
  const [data, setData] = useState({
    trending: [],
    action: [],
    horror: [],
    sciFi: [],
    cast: [],
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, action, horror, sciFi, castData] = await Promise.all([
          tmdbService.fetchFromTMDB("/trending/movie/day"),

          tmdbService.fetchFromTMDB(
            "/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=28,80&sort_by=popularity.desc&language=en-US&page=1"
          ),

          tmdbService.fetchFromTMDB(
            `/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=27&sort_by=popularity.desc&primary_release_year=${currentYear}`
          ),
          tmdbService.fetchFromTMDB(
            `/discover/movie?api_key=c46ca2b4791f4cf722454d2be403d2ac&with_genres=878&sort_by=popularity.desc`
          ),
          tmdbService.fetchFromTMDB(
            `/person/popular?api_key=c46ca2b4791f4cf722454d2be403d2ac&language=en-US&page=1`
          ),
        ]);

        setData({
          trending: trending.results,
          action: action.results,
          horror: horror.results,
          sciFi: sciFi.results,
          cast: castData.results,
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
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryButtonContainer}>
          <Pressable
            onPress={() => navigation.navigate("Anime")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>Anime</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Music")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>Discover</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("BollyWood")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>Bollywood</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("SouthMovies")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>South Movies</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("HollyWood")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>HollyWood</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Family")}
            style={styles.categoryButton}
          >
            <Text style={styles.categoryButtonText}>Animated</Text>
          </Pressable>
        </View>
      </ScrollView>
      <TrendingMovies data={data.trending} />
      <HomeCast navigation={navigation} cast={data.cast} />

      <MovieList title="Action" data={data.action} />

      <MovieList title="Horror" data={data.horror} />

      <Text
        style={{
          justifyContent: "center",
          color: "grey",
          marginLeft: 100,
          marginBottom: 5,
          fontWeight: "600",
          fontSize: 15,
        }}
      >
        Developed with 🖤 in INDIA by Nitin
      </Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
      ></StatusBar>

      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="white" />
        <Text style={styles.title}>
          <Text style={{ color: "#FF007F" }}>C</Text>
          <Text style={{ color: "white" }}>ine</Text>
          <Text style={{ color: "#FF007F" }}>C</Text>
          <Text style={{ color: "white" }}>ue</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF007F" />
        </View>
      ) : data.trending.length === 0 &&
        data.action.length === 0 &&
        data.horror.length === 0 &&
        data.sciFi.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require("../assets/images/no-connection.png")}
            style={styles.noDataImage}
            resizeMode="contain"
          />
          <Text style={styles.noDataText}>
            No data available. Check your connection.
          </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
  categoryButtonContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
  },

  categoryButton: {
    backgroundColor: "#FF007F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  categoryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  
  noDataImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  
  noDataText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  
});

export default App;
