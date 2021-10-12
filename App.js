import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Entry from './Screens/EntryScreen';
import Gallery from './Screens/GalleryScreen';
import Game from './Screens/GameScreen';
const Stack = createStackNavigator();
import { Provider } from "react-global-hook";
import { Store } from "./Store";


export default function App() {

  const [pin, setPin] = useState(0);
  return (
    <Provider  store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen
            name="Entry"
            component={Entry}
          />
          <Stack.Screen
            name="Gallery"
            component={Gallery}
          />
          <Stack.Screen
            name="Game"
            component={Game}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  punch: {
    fontSize: 50
  }
});
