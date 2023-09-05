import React, { useEffect, useState } from 'react';
import { ScrollView, LogBox, StyleSheet, ImageBackground, Image, Text, View, TouchableOpacity } from 'react-native';

import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import { useStore } from "../Store";
import twobtwo from './../assets/twobtwo.png';
import twobone from './../assets/twobone.png';
import twoaone from './../assets/twoaone.png';
import twoatwo from './../assets/twoatwo.png';

import threeone from './../assets/threeone.png';
import threetwo from './../assets/threetwo.png';
import threethree from './../assets/threethree.png';

import oneaone from './../assets/oneaone.png';
import onebone from './../assets/onebone.png';


export default function ThingsToCarrySCreen({ navigation, route }) {

    [things, setThings] = useState([]);
    [clients, setClients] = useState([]);
    [locations, setLocations] = useState([]);
    [thingsToCarry, setThingsToCarry] = useState(null);
    const [state, actions] = useStore();


    let numberOfThings = route.params?.numberOfThings;
    let configType = route.params?.configType;


    function getImageForThing(number) {
        if (numberOfThings == 1 && configType == 0)
            return oneaone;
        if (numberOfThings == 1 && configType == 1)
            return onebone;

        if (numberOfThings == 3 && number == 1)
            return threeone;
        if (numberOfThings == 3 && number == 2)
            return threetwo;
        if (numberOfThings == 3 && number == 3)
            return threethree;

        if (numberOfThings == 2 && configType == 2 && number == 1)
            return twoaone;
        if (numberOfThings == 2 && configType == 2 && number == 2)
            return twoatwo;

        if (numberOfThings == 2 && configType == 3 && number == 1)
            return twobone;
        if (numberOfThings == 2 && configType == 3 && number == 2)
            return twobtwo;


    }


    if (!thingsToCarry) {
        let newThingsToCarry = [];
        for (let a = 0; a < numberOfThings; a++) {
            newThingsToCarry.push({
                itemNumber: a + 1,
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



        <ImageBackground source={background} style={styles.container} resizeMode="cover">

            <Text style={styles.punch}>Provide details of each item</Text>

            <ScrollView style={styles.scrollContainer}>
                {thingsToCarry?.map((thingToCarry) => {
                    return (
                        <View style={styles.introCard}
                        >
                            <View style={styles.hiMsg}>

                                <Text style={styles.punch}>Item {thingToCarry.itemNumber} is</Text>

                                <Image source={getImageForThing(thingToCarry.itemNumber)} style={styles.single}>
                                </Image>
                                <View style={styles.options}>

                                    {things?.map((thing) => {
                                        return (
                                            <TouchableOpacity style={thingToCarry.type == thing.name ? styles.goButtonSelected : styles.goButton}
                                                onPress={() => {
                                                    handleStateChange(thingToCarry.itemNumber, 'type', thing)
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

                                <Text style={styles.punch}>For which client </Text>
                                <View style={styles.options}>

                                    {clients?.map((client) => {
                                        return (
                                            <TouchableOpacity style={thingToCarry.client == client.name ? styles.goButtonSelected : styles.goButton}
                                                onPress={() => {
                                                    handleStateChange(thingToCarry.itemNumber, 'client', client)
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

                                <Text style={styles.punch}>Pickup Point </Text>
                                <View style={styles.options}>

                                    {locations?.map((location) => {
                                        return (
                                            <TouchableOpacity style={thingToCarry.pickup == location.name ? styles.goButtonSelected : styles.goButton}
                                                onPress={() => {
                                                    handleStateChange(thingToCarry.itemNumber, 'pickup', location)
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

                                <Text style={styles.punch}>DropOff Point </Text>
                                <View style={styles.options}>

                                    {locations?.map((location) => {
                                        return (
                                            <TouchableOpacity style={thingToCarry.dropoff == location.name ? styles.goButtonSelected : styles.goButton}
                                                onPress={() => {
                                                    handleStateChange(thingToCarry.itemNumber, 'dropoff', location)
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
            </ScrollView>

        </ImageBackground>

        <View style={styles.actions}>
            {numberOfThings ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {

                    actions.updateSelectedThings(thingsToCarry);
                    actions.updateSelectedConfig(configType);
                    
                    navigation.navigate('AssignToDriver', { numberOfThings })
                }}
            >
                <Text>
                    Next
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('NumberOfThings', { numberOfThings })
                }}>
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
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    single: {
        width: 250,
        height: 100,
        marginBottom: 20
    },
    actions: {
        flexDirection: 'row-reverse',

        justifyContent: 'space-between'
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
        fontSize: 22,
        marginBottom: 10,
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
        width: '35%',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20
    },
    goButton: {
        fontSize: 24,
        color: '#ffbd59',
        marginBottom: 5,
        backgroundColor: 'rgba(0,0,0,0.07)',
        padding: 10,
        marginRight: 50
    },
    goButtonSelected: {
        fontSize: 24,
        color: '#ffbd59',
        marginBottom: 5,
        backgroundColor: 'rgba(0,250,0,0.2)',
        padding: 10,
        marginRight: 50
    }



});