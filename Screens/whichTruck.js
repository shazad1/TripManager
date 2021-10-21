import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import * as Network from 'expo-network';
import * as Location from 'expo-location';


export default function WhichTruckScreen({ navigation, route }) {

    [fleet, setFleet] = useState([]);
    [selectedTruck, setSelectedTruck] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/fleet")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let fleet = [];
                        snapshot.forEach(function (snp) {
                            fleet.push(snp.val());
                        });

                        setFleet(fleet);

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

                <Text>Click the truck for this trip</Text>
                {fleet?.map((truck) => {
                    return (
                        <TouchableOpacity style={truck.regNo == selectedTruck ? styles.introCardSelected : styles.introCard}
                            onPress={() => {
                                setSelectedTruck(truck.regNo);
                            }}
                        >
                            <View style={styles.hiMsg}>
                                <Text style={styles.punch}>{truck.name}</Text>
                            </View>
                            <View style={styles.secondLine}>
                                <View style={styles.inforLet}>
                                    <Text style={styles.heading}>
                                        {truck.regNo}
                                    </Text>
                                    <Text style={styles.para}>
                                        RegNo
                                    </Text>
                                </View>
                                <View style={styles.inforLet}>
                                    <Text style={styles.heading}>
                                        {truck.drive}
                                    </Text>
                                    <Text style={styles.para}>
                                        Drive
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.secondLine}>
                                <View style={styles.inforLet}>
                                    <Text style={styles.heading}>
                                        {truck.class}
                                    </Text>
                                    <Text style={styles.para}>
                                        Class
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>)
                })}


            </ImageBackground>
        </ScrollView>
        <View>
            {selectedTruck ? (<TouchableOpacity style={styles.tripButton}
                                        onPress={() => {
                                            navigation.navigate('NumberOfThings', {  })
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