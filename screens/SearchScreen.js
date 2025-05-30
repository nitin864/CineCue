import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TMDBService from "../utils/api";

const { width, height } = Dimensions.get("window");
const tmdbService = new TMDBService();

const SearchScreen = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await tmdbService.serachFetchFromTMDB(
        `/search/movie?query=${query}`
      );
      setResults(results.results || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="What's in your mind?.."
          placeholderTextColor={"lightgray"}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
          onPress={() => navigation.navigate("Family")}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryButtonText}>Animated</Text>
        </Pressable>

      </View>
      <View style={styles.categoryButtonContainer}>
        <Pressable
          onPress={() => navigation.navigate("HollyWood")}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryButtonText}>HollyWood</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("SouthMovies")}
          style={styles.categoryButton}
        >
          <Text style={styles.categoryButtonText}>South Movies</Text>
        </Pressable>
 
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF007F" />
        </View>
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          <Text style={styles.resultsText}>Results ({results.length})</Text>
          <View style={styles.resultContainer}>
            {results.map((item, index) => {
              const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : null;

              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View style={styles.card}>
                    <Image
                      source={
                        posterUrl
                          ? { uri: posterUrl }
                          : require("../assets/images/no.png")
                      }
                      style={styles.poster}
                    />
                    <Text style={styles.movieTitle}>
                      {item.title?.length > 22
                        ? item.title.slice(0, 22) + "..."
                        : item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.centered}>
          <Image
            source={require("../assets/images/null.png")}
            style={{ height: 300, width: 300 }}
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    paddingTop: 7,
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#737373",
    borderRadius: 50,
    paddingHorizontal: 10,
    backgroundColor: "#1e1e1e",
  },
  input: {
    flex: 1,
    fontWeight: "800",
    color: "white",
    fontSize: 20,
    fontFamily: "sans-serif",
    paddingVertical: 8,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 8,
    backgroundColor: "#737373",
    borderWidth: 1,
    borderColor: "#737373",
    borderRadius: 50,
  },
  resultsText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 10,
  },
  resultContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 16,
    width: width * 0.44,
  },
  poster: {
    width: "100%",
    height: height * 0.3,
    borderWidth: 1,
    borderRadius: 30,
    marginTop: 4,
  },
  movieTitle: {
    color: "lightgrey",
    marginLeft: 5,
    marginBottom: 5,
  },
  centered: {
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
});
