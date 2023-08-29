import React, { useState,useEffect } from 'react';
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
import WhichTruckScreen from './Screens/whichTruck';
import NumberOfThingsScreen from './Screens/NumberOfThings';
import ThingsToCarrySCreen from './Screens/ThingsToCarry';
import AssignToDriverScreen from './Screens/AssignToDriver';
import TripAssignmentScreen from './Screens/TripAssignment';
import TruckEditorScreen from './Screens/TruckEditor';
import YardEntryClientScreen from './Screens/YardEntryClient';
import YardEntryChassisScreen from "./Screens/YardEntryChassis";
import * as Location from 'expo-location';
import { useStore } from "./Store";
import firebase from './Backend/firebase';


const __sendLocation = async (location) => {
  try {





      if (!trip) {

        return;
      } else {

      }

      let latLong = {
          latitude: location?.latitude,
          longitude: location?.longitude
      };



      let textLoc = await Location.reverseGeocodeAsync(latLong);


      let locatObject = {
          city: textLoc[0]?.city,
          region: textLoc[0]?.region,
          street: textLoc[0]?.street,
          subRegion: textLoc[0]?.subregion,
          postCode: textLoc[0]?.postalCode
      };

      firebase.database
          .ref("1/tracks/" + trip.tripCode)
          .child("points").push({
              latLong: latLong,
              location: (locatObject.city + " " + locatObject.region + " " + locatObject.subRegion + " " + locatObject.street + " " + locatObject.postCode),
              date: (new Date()).toString(),

          }
          );

      firebase.database
          .ref("1/tracks/" + trip.tripCode)
          .child("pin").set(CurrentPin
          );

      firebase.database
          .ref("1/tracks/" + trip.tripCode)
          .child("tripName").set(trip.name
          );
  } catch (ex) {
      console.log(ex);
  }
}
let location;
const watch_location = async () => {
  if (locationPermitStatus) {
     location = await Location.watchPositionAsync({
       accuracy: Location.Accuracy.High,
       timeInterval: 80000,
       distanceInterval:0
       }
       ,(location_update) => {

     __sendLocation(location_update.coords);
     })
  }
}


let locationPermitStatus = false;
let trip = null;
let CurrentPin = null;
export default function App() {

  const [pin, setPin] = useState(0);
  const [state, actions] = useStore();

  function onDataFromTripScreen(data) {

    trip = data.trip;
    CurrentPin = data.pin;
  }

  useEffect(() => {
    (async () => {
      let { status } = await  Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
      locationPermitStatus = false;
        return;
     } else {
       console.log('Access granted!!')
       locationPermitStatus = true;
       watch_location();
     }
    
    })();
    return function cleanup() {
      location.remove();
    }
  }, []);




  return (
    <Provider store={Store}>
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
            initialParams={{sendData: onDataFromTripScreen}}
          />
          <Stack.Screen
            name="WhichTruck"
            component={WhichTruckScreen}
          />
          <Stack.Screen
            name="NumberOfThings"
            component={NumberOfThingsScreen}
          />

          <Stack.Screen
            name="ThingsToCarry"
            component={ThingsToCarrySCreen}
          />

          <Stack.Screen
            name="AssignToDriver"
            component={AssignToDriverScreen}
          />
          <Stack.Screen
            name="TripAssignment"
            component={TripAssignmentScreen}
          />
          <Stack.Screen
            name="TruckEditor"
            component={TruckEditorScreen}
          />
            <Stack.Screen
            name="YardEntryClient"
            component={YardEntryClientScreen}
          />
                      <Stack.Screen
            name="YardEntryChassis"
            component={YardEntryChassisScreen}
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
