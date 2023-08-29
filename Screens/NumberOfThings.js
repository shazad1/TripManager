import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TextInput, LogBox, StyleSheet, ImageBackground, Image, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import threeitem from "./../assets/3-item.png"
import twoaitem from "./../assets/2a-item.png"
import twobitem from "./../assets/2b-item.png"
import oneaitem from "./../assets/1a-item.png"
import onebitem from "./../assets/1b-item.png"

export default function NumberOfThingsScreen({ navigation, route }) {

    [fleet, setFleet] = useState([]);
    [numberOfThings, setNumberOfThings] = useState(null);
    [configType, setConfigType] = useState(null);


    LogBox.ignoreAllLogs(true);
    console.log("reached");

    return (<View style={styles.container}>



        <ImageBackground source={background} style={styles.container} resizeMode="cover">
   

                <Text style={styles.punch}>Okey, tell me the number of things truck is going to tow?</Text>
                <ScrollView style={styles.scrollContainer}>
                {[1,1,2,2,3]?.map((number, index) => {
                    return (
                        <TouchableOpacity style={numberOfThings == number && configType == index ? styles.introCardSelected : styles.introCard}
                            onPress={() => {

                                setNumberOfThings(number);
                                setConfigType(index);
                            }}
                        >
                            <View style={styles.hiMsg}>

                                <Text style= {styles.punch}>
                                    {number == 1 ? number + " Item like this " : number + " Items like this"}
                                </Text>
                                {number == 3 ? (<Image source={threeitem} style={styles.single}>
                                </Image>) : null}
                                
                                {(number == 1 && index == 0) ? (<Image source={oneaitem} style={styles.single}>
                                </Image>) : null}
                               
                                {(number == 1 && index == 1) ? (<Image source={onebitem} style={styles.single}>
                                </Image>) : null}
                               
                                {(number == 2 && index == 2) ? (<Image source={twoaitem} style={styles.single}>
                                </Image>) : null}
                               
                                {(number == 2 && index == 3) ? (<Image source={twobitem} style={styles.single}>
                                </Image>) : null}


                            </View>

                        </TouchableOpacity>)
                })}

            </ScrollView>
            <View style={styles.actions}>
                {numberOfThings ? (<TouchableOpacity style={styles.tripButton}
                    onPress={() => {
                        navigation.navigate('ThingsToCarry', { numberOfThings, configType })
                    }}
                >
                    <Text>
                        Next
                    </Text>

                </TouchableOpacity>) : null}
                <TouchableOpacity style={styles.tripButton}
                    onPress={() => {
                        navigation.navigate('WhichTruck', {})
                    }}
                >
                    <Text>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>


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
        height: 150,
        marginBottom: '2%',
        flexDirection: 'column',
        alignItems: 'center',
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
        height: 130,
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
        marginBottom: 10,
        marginTop: 10,
        color: '#ff1616',
        paddingLeft: 10
    },

    hiMsg: {
        fontSize: 30,
        alignSelf: 'center',
        justifyContent: 'center',
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