import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './navigation/AppNavigation'; // or whatever your main component is

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigation /> 
    </GestureHandlerRootView>
  );
}

 