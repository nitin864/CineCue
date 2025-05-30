import { View, Text } from "react-native";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import MovieList from "../components/MovieList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NavigationContainer } from "@react-navigation/native";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import Bollywood from "../screens/Bollywood";
import SouthMovies from "../screens/SouthMovies";
import HollyWood from "../screens/HollyWood";
import Family from "../screens/Family";
import AnimeScreen from "../screens/AnimeScreen";
import MusicScreen from "../screens/MusicScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Movie"
          options={{ headerShown: false }}
          component={MovieScreen}
        />
        <Stack.Screen
          name="Person"
          options={{ headerShown: false }}
          component={PersonScreen}
        />
        <Stack.Screen
          name="Search"
          options={{ headerShown: false }}
          component={SearchScreen}
        />
        <Stack.Screen
          name="BollyWood"
          options={{ headerShown: false }}
          component={Bollywood}
        />
        <Stack.Screen
          name="SouthMovies"
          options={{ headerShown: false }}
          component={SouthMovies}
        />
        <Stack.Screen
          name="HollyWood"
          options={{ headerShown: false }}
          component={HollyWood}
        />
        <Stack.Screen
          name="Family"
          options={{ headerShown: false }}
          component={Family}
        />
        <Stack.Screen
          name="Anime"
          options={{ headerShown: false }}
          component={AnimeScreen}
        />
        <Stack.Screen
          name="Music"
          options={{ headerShown: false }}
          component={MusicScreen}
        />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
