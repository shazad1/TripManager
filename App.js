import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Entry from './Screens/EntryScreen';
import Gallery from './Screens/GalleryScreen';
const Stack = createStackNavigator();
import { Provider } from "react-global-hook";
import { Store } from "./Store";
import DashboardScreen from './Screens/DashboardScreen';
import TripScreen from './Screens/TripScreen';


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
            name="Dashboard"
            component={DashboardScreen}
          />
          <Stack.Screen
            name="Trip"
            component={TripScreen}
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
