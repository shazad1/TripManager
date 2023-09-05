import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ToastAndroid, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../Store';


export default function DashboardScreen({ navigation, route }) {


    const pin = route.params?.pin;
    const driver = route.params?.driver;
    const role = route.params?.role;

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [newTrips, setNewTrips] = useState([]);
    const [progress, setProgress] = useState(true);
    const [myDrivers, setMyDrivers] = useState([]);
    const [selectedMyDriver, setSelectedMyDriver] = useState(null);
    const [myDriversTrip, setMyDriversTrips] = useState([]);

    const [networkState, setNetworkState] = useState(null);
    const [state, actions] = useStore();




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
                    .orderByChild('status').equalTo('active')
                    .on('value', snapshot => {
                        let trips = [];
                        snapshot.forEach(function (snp) {
                            trips.push(snp.val());
                        });

                        setNewTrips(trips);
                        setProgress(false);

                    })


                firebase.database.ref("1/drivers/")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let drivers = [];
                        snapshot.forEach(function (snp) {

                            drivers.push(snp.val());
                        });

                        setMyDrivers(drivers);

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


    function bringDriversTrip(driverPin) {

        firebase.database.ref("1/people/" + driverPin + "/trips")
            .orderByChild('status').equalTo('active')
            .on('value', snapshot => {
                let trips = [];
                snapshot.forEach(function (snp) {
                    trips.push(snp.val());

                });


                setMyDriversTrips(trips);

            })
    }

    function adjustPrice(price) {
        ;
    }

    return (<View style={styles.container}>
        {progress ? (<Progress.CircleSnail size={200} indeterminate={true}

            style={styles.progress}
            progress={progress}
            thickness={10}
            color='#e4581e'
            showsText={true}
        />) : (
            <ScrollView>
                {/* <ImageBackground source={background} style={styles.container} resizeMode="cover"> */}
                <LinearGradient colors={['#061933', '#4f74a8', '#061933']} style={styles.linearGradient}>
                    <View style={styles.introCard}>
                        <View style={styles.hiMsg}>
                            <Text style={styles.punch}>Hi {driver}</Text>
                        </View>
                        <View style={styles.secondLine}>
                            <View style={styles.inforLet}>
                                <Text style={styles.heading}>
                                    1.0.1
                                </Text>
                                <Text style={styles.para}>
                                    App Version
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

                                <TouchableOpacity style={styles.tripButton}
                                    onPress={() => {
                                        navigation.navigate('Entry', {})
                                    }}
                                >
                                    <Text style={styles.tripButtonText}>
                                        Log out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={styles.introCard}>
                        <View style={styles.hiMsg}>
                            <Text style={styles.punch}>My Current Trips</Text>
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
                                        <Text style={styles.tripButtonText}>
                                            {trip.name}</Text>
                                    </TouchableOpacity>)
                            })
                            }
                        </View>
                    </View>




                    <View style={[styles.introCard]}>
                        <View style={styles.hiMsg}>
                            <Text style={styles.punch}>Operations</Text>
                        </View>
                        <View style={styles.trips}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('YardEntryClient', {})
                            }}
                                style={[styles.tripButton, styles.disabled]}
                            >
                                <Text style={styles.tripButtonText}>Yard Entry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={true}
                                style={[styles.tripButton, styles.disabled]}
                            >
                                <Text style={styles.tripButtonText}>Edit/Delete a Trip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={true}
                                style={[styles.tripButton, styles.disabled]}
                            >
                                <Text style={styles.tripButtonText}>Add Edit or Delete Driver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={true}
                                style={[styles.tripButton, styles.disabled]}
                            >
                                <Text style={styles.tripButtonText}>Add Edit or Delete a Client</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tripButton]}
                                onPress={() => {
                                    navigation.navigate('TruckEditor', {})
                                }}
                            >
                                <Text style={styles.tripButtonText}>Add Edit or Delete Trucks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={true}
                                style={[styles.tripButton, styles.disabled]}
                            >
                                <Text style={styles.tripButtonText}>Add Edit or Delete Things to tow</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.tripButton}
                            >
                                <Text style={styles.tripButtonText}>Edit your details</Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                    {role == 'owner' ? (<View style={styles.introCard}>
                        <View style={styles.hiMsg}>
                            <Text style={styles.punch}>My Drivers Trips</Text>
                        </View>
                        <Text style={styles.heading}>Click the driver to veiw his trips</Text>
                        <View style={styles.drivers}>
                            {
                                myDrivers.map(driver => {
                                    return (<TouchableOpacity style={driver.pin == selectedMyDriver?.pin ? styles.selectedDriver : styles.driver}
                                        onPress={() => {
                                            setSelectedMyDriver(driver);
                                            bringDriversTrip(driver.pin);
                                        }

                                        }
                                    >
                                        <Text>
                                            {driver.name}
                                        </Text>
                                    </TouchableOpacity>)
                                })
                            }
                        </View>
                        <View style={styles.trips}>

                            {myDriversTrip?.map((trip) => {
                                return (
                                    <View style={styles.driverTrip}>

                                        <View style={styles.driverTripLine2}>
                                            <Text style={styles.punch}> Trip Code {trip.tripCode}</Text>
                                            <TouchableOpacity
                                                style={{ marginRight: 2, alignSelf: 'center', padding: 8, backgroundColor: '#ffbd59' }}
                                                onPress={async () => {

                                                    setProgress(true);
                                                    await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/emailCodeToClient?pin=" + selectedMyDriver?.pin + "&&business=1&&tripName=" + trip.name + "&&name=" + state.loggedInName + "&&email=" + state.loggedInEmail);
                                                    setProgress(false);
                                                    ToastAndroid.show('Email sent to registered client email');
                                                }}
                                            >
                                                <Text>Email Code to Client</Text>
                                            </TouchableOpacity>
                                            <Progress.Pie progress={trip.progress} size={40} color={trip.progress > 0.98 ? '#00ff00' : "#ff0000"} />
                                        </View>

                                        <View style={styles.driverTripLine2}>

                                            {trip?.thingsToCarry[0] ? (<Text style={styles.smaller}>
                                                {trip?.thingsToCarry[0].type}  for {trip?.thingsToCarry[0].client}  from &nbsp;
                                                {trip?.thingsToCarry[0].pickup} to  {trip?.thingsToCarry[0].dropoff}
                                            </Text>) : null}
                                            {trip?.thingsToCarry[1] ? (<Text style={styles.smaller}>
                                                {trip?.thingsToCarry[1].type} for   {trip?.thingsToCarry[1].client}  from &nbsp;
                                                {trip?.thingsToCarry[1].pickup} to  {trip?.thingsToCarry[1].dropoff}
                                            </Text>) : null}
                                            {trip?.thingsToCarry[2] ? (<Text style={styles.smaller}>
                                                {trip?.thingsToCarry[2].type} for    {trip?.thingsToCarry[2].client} from &nbsp;
                                                {trip?.thingsToCarry[2].pickup} to  {trip?.thingsToCarry[2].dropoff}
                                            </Text>) : null}


                                        </View>


                                        <View style={styles.driverTripLine2}>
                                            <TouchableOpacity
                                                style={styles.driver}
                                                onPress={() => {
                                                    navigation.navigate('Trip', { trip: trip, pin: selectedMyDriver?.pin })
                                                }}
                                            >
                                                <Text>Open Trip</Text>
                                            </TouchableOpacity>

                                            {trip.thingsToCarry.map(thing => {
                                                return <TouchableOpacity
                                                    style={styles.driver}
                                                    onPress={async () => {

                                                        setProgress(true);
                                                        await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/createTripReport?pin=" + selectedMyDriver?.pin + "&&business=1&&tripName=" + trip.name + "&&name=" + state.loggedInName + "&&email=" + state.loggedInEmail + "&&chasis=" + thing.chasis);
                                                        setProgress(false);
                                                        ToastAndroid.show('Email sent to  ' + state.loggedInEmail, ToastAndroid.LONG);
                                                    }}

                                                >
                                                    <Text>Email Report Chassis {thing.chasis} </Text>
                                                </TouchableOpacity >
                                            })}

                                        </View>
                                        {(<View style={styles.driverTripLine1}>
                                            {/* <SafeAreaView>
                                                <TextInput
                                                    style={styles.input}
                                                    onChangeText={(text) => {
                                                        adjustPrice(text);
                                                    }}

                                                    placeholder="$AUD 990"

                                                />
                                            </SafeAreaView> */}
                                            <TouchableOpacity
                                                style={styles.driver}
                                                onPress={async () => {
                                                    setProgress(true);
                                                    await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/createTripInvoice?pin=" + selectedMyDriver?.pin + "&&business=1&&tripName=" + trip.name + "&&name=" + state.loggedInName + "&&email=" + state.loggedInEmail);
                                                    setProgress(false);
                                                    ToastAndroid.show('Email sent to  ' + state.loggedInEmail, ToastAndroid.LONG);
                                                }
                                                }

                                            >
                                                <Text>Email me Invoice</Text>
                                            </TouchableOpacity>
                                        </View>)}

                                    </View>
                                )
                            })
                            }
                        </View>


                    </View>) : null}
                </LinearGradient>
                {/* </ImageBackground> */}
            </ScrollView>)}
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

    },
    disabled: {
        backgroundColor: '#ddd'
    },
    drivers: {
        flexWrap: 'wrap'
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    driverTrip: {
        marginBottom: 3,
        marginTop: 3,
        flexDirection: 'column',
        borderColor: '#ffbd59',
        borderWidth: 1,
        width: '100%'
    },
    driverTripLine1: {
        flexDirection: 'row',
        justifyContent: "space-around"
    },

    driverTripLine2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-around"
    },
    driver: {
        padding: 8,
        margin: 8,
        backgroundColor: '#ffbd59'
    },
    selectedDriver: {
        padding: 8,
        margin: 8,
        backgroundColor: 'rgba(0,200,0, 0.2)',
    },
    progress: {
        margin: 1,
        alignSelf: 'center'
    },
    introCard: {
        marginTop: '10%',
        alignSelf: 'center',
        marginBottom: '10%',
        flexDirection: 'column',
        borderWidth: 3,
        borderColor: '#e4581e',
        backgroundColor: '#d7d4d2',
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
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 10,
        marginBottom: 40,
        color: '#e4581e',
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
        color: '#e4581e',
        fontSize: 15,
    },
    para: {
        color: '#061933',
        fontSize: 15,
    },
    inforLet: {
        flexDirection: 'column',
        margin: 10,
        borderLeftWidth: 8,
        borderLeftColor: '#ffbd59',
        paddingLeft: 10
    },
    smaller: {
        fontSize: 15,
        marginBottom: 10,
        marginTop: 10,
        color: '#ff1616'
    },

    tripButton: {
        fontSize: 44,
        color: '#e4581e',
        width: '95%',
        marginBottom: 5,
        marginTop: 15,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#061933',

    },
    tripButtonText: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: '#e4581e',
        paddingLeft: 10
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
