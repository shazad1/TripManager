import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
<<<<<<< HEAD

=======
>>>>>>> d3b0f56702163d77c65f5c665b9dc22a02b6af48


export default function ThingsToCarrySCreen({ navigation, route }) {

    [things, setThings] = useState([]);
    [clients, setClients] = useState([]);
    [locations, setLocations] = useState([]);
<<<<<<< HEAD
=======
    [thingsToCarry, setThingsToCarry] = useState(null);
>>>>>>> d3b0f56702163d77c65f5c665b9dc22a02b6af48

    let numberOfThings = route.params?.numberOfThings;


    if (!thingsToCarry) {
        let newThingsToCarry = [];
        for (let a = 0; a < numberOfThings; a++) {
            newThingsToCarry.push({
                itemNumber: a+1,
                type: null,
                pickup: null,
                dropoff: null,
                client: null
            });
            console.log("yes");
        }

        setThingsToCarry(newThingsToCarry);
    }


    function handleStateChange(itemNumber, selectionName, selectionValue) {
        let newThingsToCarry = thingsToCarry.map(t2c => {

            if (t2c.itemNumber == itemNumber) {
                t2c[selectionName] = selectionValue.name;
            }
            return t2c;

            
        });
        setThingsToCarry(newThingsToCarry);

        console.log(thingsToCarry);
    }

    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/things")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let things = [];
                        snapshot.forEach(function (snp) {
                            things.push(snp.val());
                        });


                        setThings(things);
                        console.log(things);

                    })

            } catch (ex) {
                console.log(ex);
            }


        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/clients")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let clients = [];
                        snapshot.forEach(function (snp) {
                            clients.push(snp.val());
                        });


                        setClients(clients);


                    })

            } catch (ex) {
                console.log(ex);
            }


        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/locations")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let locs = [];
                        snapshot.forEach(function (snp) {
                            locs.push(snp.val());
                        });


                        setLocations(locs);


                    })

            } catch (ex) {
                console.log(ex);
            }


        })();
    }, []);


    LogBox.ignoreAllLogs(true);
    console.log("reached");

    return (<View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>


            <ImageBackground source={background} style={styles.container} resizeMode="cover">

                <Text>Provide details of each item</Text>
                {thingsToCarry?.map((thingToCarry) => {
                    return (
                        <View style={styles.introCard}
                        >
                            <View style={styles.hiMsg}>

                                <Text>What type of item is this? </Text>
                                <View style={styles.options}>

                                    {things?.map((thing) => {
                                        return (
                                            <TouchableOpacity style={ thingToCarry.type == thing.name ? styles.goButtonSelected : styles.goButton}
                                            onPress = {() =>{
                                                handleStateChange(thingToCarry.itemNumber,'type', thing)
                                            }

                                            }
                                            >
                                                <Text>
                                                    {thing.name}
                                                </Text>
                                            </TouchableOpacity>

                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.hiMsg}>

                                <Text>For which client </Text>
                                <View style={styles.options}>

                                    {clients?.map((client) => {
                                        return (
                                            <TouchableOpacity style={ thingToCarry.client == client.name ? styles.goButtonSelected : styles.goButton}
                                            onPress = {() =>{
                                                handleStateChange(thingToCarry.itemNumber,'client', client)
                                            }

                                            }>
                                                <Text>
                                                    {client.name}
                                                </Text>
                                            </TouchableOpacity>

                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.hiMsg}>

                                <Text>Pickup Point </Text>
                                <View style={styles.options}>

                                    {locations?.map((location) => {
                                        return (
                                            <TouchableOpacity style={ thingToCarry.pickup == location.name ? styles.goButtonSelected : styles.goButton}
                                            onPress = {() =>{
                                                handleStateChange(thingToCarry.itemNumber,'pickup', location)
                                            }

                                            }>
                                                <Text>
                                                    {location.name}
                                                </Text>
                                            </TouchableOpacity>

                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.hiMsg}>

                                <Text>DropOff Point </Text>
                                <View style={styles.options}>

                                    {locations?.map((location) => {
                                        return (
                                            <TouchableOpacity style={ thingToCarry.dropoff == location.name ? styles.goButtonSelected : styles.goButton}
                                            onPress = {() =>{
                                                handleStateChange(thingToCarry.itemNumber,'dropoff', location)
                                            }

                                            }>
                                                <Text>
                                                    {location.name}
                                                </Text>
                                            </TouchableOpacity>

                                        )
                                    })}
                                </View>
                            </View>

                        </View>)
                })}


            </ImageBackground>
        </ScrollView>
        <View>
            {numberOfThings ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('ThingsToCarry', { numberOfThings })
                }}
            >
                <Text>
                    Next
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}>
                <Text>
                    Back
                </Text>
            </TouchableOpacity>
        </View>
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

        justifyContent: 'center'
    },
    options: {
        flexDirection: 'row'
    },
    scrollContainer: {

        height: '70%',

    },
    introCard: {
        marginTop: '2%',
        zIndex: 1000,
        marginBottom: '2%',
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
    introCardSelected: {
        marginTop: '2%',
        marginBottom: '2%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'rgba(0,200,0, 0.2)',
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
        zIndex: 999,

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
        fontSize: 24,
        color: '#ffbd59',
        marginBottom: 5,
        backgroundColor:'rgba(0,0,0,0.07)',
        padding: 10,
        marginRight: 50
    },
    goButtonSelected: {
        fontSize: 24,
        color: '#ffbd59',
        marginBottom: 5,
        backgroundColor:'rgba(0,250,0,0.2)',
        padding: 10,
        marginRight: 50
    }



});