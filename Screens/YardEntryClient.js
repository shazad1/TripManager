import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../Backend/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from "../Store";


export default function YardEntryClientScreen({ navigation, route }) {

    [clients, setClients] = useState([]);
    [selectedClient, setSelectedCLient] = useState(null);
    const [state, actions] = useStore();

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

    LogBox.ignoreAllLogs(true);
    console.log("reached");

    return (<View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>


        <LinearGradient colors={['#061933', '#4f74a8', '#061933']} style={styles.linearGradient}>

                <Text style={styles.punch}>Select the client </Text>
                {clients?.map((client) => {
                    console.log(state.loggedInRole);
                    if (state.loggedInRole == 'owner') {


                        return (
                            <TouchableOpacity style={client.name == selectedClient ? styles.introCardSelected : styles.introCard}
                                onPress={() => {
                                    setSelectedCLient(client.name);
                                    actions.updateSelectedClient(client);
                                }}

                            >
                                <View style={styles.hiMsg}>
                                    <Ionicons style={{marginLeft: 3}} name="podium" size={46} color="gray" />
                                    <Text style={styles.punch}>{client.name}</Text>

                                </View>
                                <View style={styles.secondLine}>
                                    <View style={styles.inforLet}>
                                        <Text style={styles.heading}>
                                            {client.email || client.mobile}
                                        </Text>
                                        <Text style={styles.para}>
                                            email/mobile
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                    }

                })}


            </LinearGradient>
        </ScrollView>
        <View style={styles.actions}>
            {selectedClient ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('YardEntryChassis', {})
                }}
            >
                <Text style={styles.tripButtonText}>
                    Next
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('ThingsToCarry', {})
                }}
            >
                <Text style={styles.tripButtonText}>
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
    linearGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    actions: {
        flexDirection: 'column',
        margin: '2%',
        justifyContent: 'center'
    },
    scrollContainer: {

        height: '70%',

    },
    introCard: {
        margin: '2%',
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
        margin: '2%',
   
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
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 10,
        marginBottom: 40,
        color: '#e4581e',
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