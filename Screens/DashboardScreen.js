import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import * as Progress from 'react-native-progress';


export default function DashboardScreen({ navigation, route }) {


    const pin = route.params?.pin;
    const driver = route.params?.driver;
    const owner = route.params?.owner;

    const [location, setLocation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [newTrips, setNewTrips] = useState([]);
    const [progress, setProgress] = useState(true);

    const [networkState, setNetworkState] = useState(null);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');

            }

            try {
                let location = await Location.getCurrentPositionAsync({});
                let latLong = {
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude
                };

                console.log(location);
                let textLocation = await Location.reverseGeocodeAsync(latLong)
                console.log(textLocation);
                let network = await Network.getNetworkStateAsync();


                firebase.database.ref("1/people/" + pin + "/trips")
                    .orderByChild('status').equalTo('not ended')
                    .on('value', snapshot => {
                        let trips = [];
                        snapshot.forEach(function (snp) {
                            trips.push(snp.val());
                        });

                        setNewTrips(trips);
                        setProgress(false);

                    })

                if (textLocation && textLocation[0]) {
                    setLocation({
                        city: textLocation[0].city,
                        region: textLocation[0].region,
                        street: textLocation[0].street,
                        subRegion: textLocation[0].subregion,
                        postCode: textLocation[0].postCode
                    });
                }

                setNetworkState(network);
            } catch (ex) {
                console.log(ex);
            }


        })();
    }, []);

    LogBox.ignoreAllLogs(true);
    console.log("reached");

    return (<View style={styles.container}>
        {progress ? (<Progress.Circle  size={200} indeterminate={true} 

            style={styles.progress}
            progress={progress}
            thickness={15}
            color = '#ffbd59'
            showsText={true}
        />) : (
        <ScrollView>
            <ImageBackground source={background} style={styles.container} resizeMode="cover">

                <View style={styles.introCard}>
                    <View style={styles.hiMsg}>
                        <Text style={styles.punch}>Hi {driver}</Text>
                    </View>
                    <View style={styles.secondLine}>
                        <View style={styles.inforLet}>
                            <Text style={styles.heading}>
                                {owner}
                            </Text>
                            <Text style={styles.para}>
                                Business
                            </Text>
                        </View>
                        <View style={styles.inforLet}>
                            <Text style={styles.heading}>
                                {networkState?.type} {(networkState?.isInternetReachable) ? "Online" : "Offline"}
                            </Text>
                            <Text style={styles.para}>
                                Network Status
                            </Text>
                        </View>
                    </View>
                    <View style={styles.secondLine}>
                        <View style={styles.inforLet}>
                            <View style={styles.heading}>
                                <Text style={styles.heading}>{location?.street} {location?.city} {location?.subRegion} {location?.region} {location?.postCode}</Text>
                            </View>
                            <Text style={styles.para}>
                                Current Location
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.introCard}>
                    <View style={styles.hiMsg}>
                        <Text style={styles.punch}>Current Trips</Text>
                    </View>
                    <View style={styles.trips}>

                        {newTrips?.map((trip) => {
                            return (
                                <TouchableOpacity
                                    style={styles.tripButton}
                                    onPress={() => {
                                        navigation.navigate('Trip', { trip: trip, pin: pin })
                                    }}
                                >
                                    <Text>{trip.name}</Text>
                                </TouchableOpacity>)
                        })
                        }
                    </View>
                </View>
                {/* <View style={styles.introCard}>
                    <View style={styles.hiMsg}>
                        <Text style={styles.punch}>Old Trips</Text>
                    </View>
                    <View style={styles.oldTrips}>
                        <SafeAreaView>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {
                                    setSearchText(text);
                                }}
                                value={searchText}
                                placeholder="search by name"

                            />
                        </SafeAreaView>
                        <TouchableOpacity
                            style={styles.goButton}
                        >
                            <Text>Go</Text>
                        </TouchableOpacity>

                    </View>
                </View> */}
                <View style={[styles.introCard]}>
                    <View style={styles.hiMsg}>
                        <Text style={styles.punch}>Operations</Text>
                    </View>
                    <View style={styles.trips}>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('WhichTruck', {})
                            }}
                            style={styles.tripButton}
                        >
                            <Text>Create A Trip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        disabled={true}
                            style={[styles.tripButton, styles.disabled]}
                        >
                            <Text>Edit/Delete a Trip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity disabled = {true}
                                      style={[styles.tripButton, styles.disabled]}
                        >
                            <Text>Add Edit or Delete Driver</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled = {true}
                                              style={[styles.tripButton, styles.disabled]}
                        >
                            <Text>Add Edit or Delete a Client</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled = {true}
                                                  style={[styles.tripButton, styles.disabled]}
                        >
                            <Text>Add Edit or Delete Trucks</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled = {true}
                                             style={[styles.tripButton, styles.disabled]}
                        >
                            <Text>Add Edit or Delete Things to tow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.tripButton}
                        >
                            <Text>Edit your details</Text>
                        </TouchableOpacity>


                    </View>
                </View>


            </ImageBackground>
        </ScrollView>) }
    </View>)

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 'auto'
    },
    disabled: { 
        backgroundColor: '#ddd'
    },
    progress: {
        margin: 1,
      },
    introCard: {
        marginTop: '10%',
        marginBottom: '10%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'white',
        width: '95%',
        shadowColor: "#ff0000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
    punch: {
        fontSize: 20,
        marginBottom: 40,
        marginTop: 10,
        color: '#ff1616',
        paddingLeft: 10
    },

    hiMsg: {
        fontSize: 30,

        color: '#ff1616'
    },
    secondLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    trips: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    oldTrips: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    input: {
        flexBasis: '80%',
        fontSize: 30,
        marginLeft: 10
    },
    heading: {
        color: '#ff1616',
        fontSize: 15,
    },
    para: {
        color: '#ffbd59',
        fontSize: 15,
    },
    inforLet: {
        flexDirection: 'column',
        margin: 10,
        borderLeftWidth: 8,
        borderLeftColor: '#ffbd59',
        paddingLeft: 10
    },

    tripButton: {
        fontSize: 44,
        color: '#ffbd59',
        width: '95%',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20
    },
    goButton: {
        fontSize: 44,
        color: '#ffbd59',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20,
        marginRight: 10
    }


});