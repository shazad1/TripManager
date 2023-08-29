import React, { useEffect, useState } from 'react';
import { ScrollView, LogBox, StyleSheet, SafeAreaView, TextInput, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import { useStore } from "../Store";


export default function TruckEditorScreen({ navigation, route }) {

    [fleet, setFleet] = useState([]);
    [selectedTruck, setSelectedTruck] = useState(null);
    const [state, actions] = useStore();

    function handleClassChange() {
        ;
    }

    function handleDriveChange() {
        ;
    }

    function handleNameChange() {
        ;
    }

    function handleRegoChange() {
        ;
    }

    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/fleet")
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

                <Text style={styles.punch}>Edit Delete or Add Trucks</Text>
                {fleet?.map((truck) => {
                    return (
                        <View style={styles.introCard}
                        >
                            <View style={styles.hiMsg}>

                                <SafeAreaView>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            handleNameChange(text);
                                        }}
                                        value = {truck.name}
                                        placeholder="enter truck name"

                                    />
                                </SafeAreaView>
                            </View>
                            <View style={styles.hiMsg}>

                                <SafeAreaView>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            handleRegoChange(text);
                                        }}
                                        value = {truck.regNo}
                                        placeholder="enter truck regNo"

                                    />
                                </SafeAreaView>
                            </View>
                            <View style={styles.hiMsg}>

                                <SafeAreaView>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            handleDriveChange(text);
                                        }}
                                        value = {truck.drive}
                                        placeholder="enter truck drive"

                                    />
                                </SafeAreaView>
                            </View>
                            <View style={styles.hiMsg}>

                                <SafeAreaView>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            handleClassChange(text);
                                        }}
                                        value = {truck.class}
                                        placeholder="enter truck class"

                                    />
                                </SafeAreaView>
                            </View>
                            <TouchableOpacity>
                                <Text>
                                    UPDATE
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text>
                                    DELETE
                                </Text>
                            </TouchableOpacity>
                        </View>)
                })}


            </ImageBackground>
        </ScrollView>
        <View style={styles.actions}>
            {selectedTruck ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('NumberOfThings', {})
                }}
            >
                <Text>
                    Next
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('Dashboard', {})
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
        fontSize: 20,
        marginLeft: 10,
        marginTop: 5,
        borderColor: '#ffbd59',
        borderWidth: 1
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