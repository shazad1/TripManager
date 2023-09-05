import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import { useStore } from "../Store";


export default function AssignToDriverScreen({ navigation, route }) {

    [drivers, setDrivers] = useState([]);
    [selectedDriver, setSelectedDriver] = useState(null);
    const [state, actions] = useStore();

    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/drivers")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let drs = [];
                        snapshot.forEach(function (snp) {
                            drs.push(snp.val());
                        });

                        setDrivers(drs);

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

                <Text style={styles.punch}>Click the driver for this trip</Text>
                {drivers?.map((driver) => {
                    console.log(state.loggedInRole);
                    if ((state.loggedInRole == 'driver' && state.loggedInName == driver.name) || state.loggedInRole == 'owner') {


                        return (
                            <TouchableOpacity style={driver.pin == selectedDriver ? styles.introCardSelected : styles.introCard}
                                onPress={() => {
                                    setSelectedDriver(driver.pin);
                                    actions.updateSelectedDriver(driver);
                                }}

                            >
                                <View style={styles.hiMsg}>
                                    <Ionicons style={styles.icon} name="person" size={46} color="gray" />
                                    <Text style={styles.punch}>{driver.name}</Text>

                                </View>
                                <View style={styles.secondLine}>
                                    <View style={styles.inforLet}>
                                        <Text style={styles.heading}>
                                            {driver.email}
                                        </Text>
                                        <Text style={styles.para}>
                                            email
                                        </Text>
                                    </View>
                                    <View style={styles.inforLet}>
                                        <Text style={styles.heading}>
                                            {driver.pin}
                                        </Text>
                                        <Text style={styles.para}>
                                            Pin
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.secondLine}>
                                    <View style={styles.inforLet}>
                                        <Text style={styles.heading}>
                                            {driver.mobile}
                                        </Text>
                                        <Text style={styles.para}>
                                            Mobile
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                    }

                })}


            </ImageBackground>
        </ScrollView>
        <View style={styles.actions}>
            {selectedDriver ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('TripAssignment', {})
                }}
            >
                <Text>
                    Done
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('ThingsToCarry', {})
                }}
            >
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
    actions: {
        flexDirection: 'row-reverse',

        justifyContent: 'space-between'
    },
    scrollContainer: {

        height: '70%',

    },
    introCard: {
        marginTop: '2%',
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

        marginTop: 10,
        color: '#ff1616',
        paddingLeft: 10
    },

    hiMsg: {
        fontSize: 30,
        flexDirection: 'row',
        alignItems: 'center',


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
        fontSize: 44,
        color: '#ffbd59',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20,
        marginRight: 10
    }


});