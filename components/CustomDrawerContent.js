import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.logoText}>🎬 CineCue</Text>
        <Text style={styles.welcome}> Discover More</Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#1e1e1e",
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF007F",
  },
  welcome: {
    color: "white",
    marginTop: 4,
    fontSize: 14,
  },
});
