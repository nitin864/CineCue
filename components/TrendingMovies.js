import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function TrendingMovies({ data }) {
  const navigation = useNavigation();

  // Handled item being undefined in your original handClick
  const handleClick = (item) => {
    navigation.navigate("Movie", item); // Assuming your navigation is set up for this
  };

  return (
    <View>
      <Text style={styles.maintext}>Trending🔥</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MovieCard item={item} onPress={() => handleClick(item)} />
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const MovieCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} // Replace with item.poster_path if using dynamic images
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  maintext: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
    marginTop: 5,
    marginLeft: 10,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  image: {
    width: width * 0.65,
    height: height * 0.47,
    borderRadius: 16,
  },
  cardContainer: {
    marginRight: 7,
    marginTop: 10,
  },
});
