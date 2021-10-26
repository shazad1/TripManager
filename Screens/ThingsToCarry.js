import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';



export default function ThingsToCarrySCreen({ navigation, route }) {

    [things, setThings] = useState([]);
    [clients, setClients] = useState([]);
    [locations, setLocations] = useState([]);

    let numberOfThings = route.params?.numberOfThings;

    let thingsToCarry = [];

    for (let a = 0; a < numberOfThings; a++) {
        thingsToCarry.push(a + 1);
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
                {thingsToCarry?.map((number) => {
                    return (
                        <View style={styles.introCard}
                        >
                            <View style={styles.hiMsg}>

                                <Text>What type of item is this? </Text>
                                <View style={styles.options}>

                                    {things?.map((thing) => {
                                        return (
                                            <TouchableOpacity style={styles.goButton}>
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
                                            <TouchableOpacity style={styles.goButton}>
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

                                    {clients?.map((client) => {
                                        return (
                                            <TouchableOpacity style={styles.goButton}>
                                                <Text>
                                                    {client.name}
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
        fontSize: 44,
        color: '#ffbd59',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20,
        marginRight: 10
    }


});