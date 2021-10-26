import React, { useState } from 'react';
import { LogBox, StyleSheet, ImageBackground, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import logo from './../assets/tow_logo.png'
import background from './../assets/background.png';

var _ = require("underscore");

export default function EntryScreen({ navigation }) {

    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    var game = {
        pin: 0,
        hostName: '',
        dateCreated: Date.now()
    };

    LogBox.ignoreAllLogs(true);



    return (
        <View style={styles.container}>
            <ImageBackground source={background} style={styles.container} resizeMode="cover">
                <View style={styles.logoContainer}>
                    <ImageBackground source={logo} resizeMode="cover"
                        style={styles.logo}>
                    </ImageBackground>
                </View>

                <View style={styles.actions}>

                    <SmoothPinCodeInput
                        placeholder="⭑"
                        cellSize={46}
                        codeLength={5}
                        cellStyle={{
                            borderWidth: 2,
                            borderRadius: 15,
                            borderColor: '#ffbd59',
                            backgroundColor: 'azure',
                        }}
                        cellStyleFocused={{
                            borderColor: 'lightyellow',
                            backgroundColor: 'lightyellow',
                        }}
                        textStyle={{
                            fontSize: 24,
                            color: 'salmon'
                        }}
                        textStyleFocused={{
                            color: 'crimson'
                        }}
                        value={pin}
                        onTextChange={code => {
                            setPin(code);
                        }}
                    />
                    <TouchableOpacity
                        style={styles.actionButton}

                        onPress={() => {


                                try {
                                    console.log(pin);
                                    firebase.database.ref("1/people/" + pin + "/profile")
                                        .once('value', snap => {
                                            console.log(snap.val());
                                            var data = snap.val();
                                            if (data) {

                                                navigation.navigate('Dashboard', {
                                                    pin: pin,
                                                    owner: data.owner,
                                                    driver: data.driver
                                                })
                                            } else {
                                                setMessage("ERROR!!! Looks like we don't have you in the records");
                                            }

                                        });
                                } catch (ex) {
                                    console.log(ex);
                                }

                            }
                        }

                        
                    >
                        <Text>Enter</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.actions}>
                    <SafeAreaView>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setEmail(text);
                            }}
                            value={email}
                            placeholder=" forgot pin?  enter email "

                        />
                    </SafeAreaView>
                    <TouchableOpacity
                        style={styles.actionButton}
                    >
                        <Text>Email Pin</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.punch}>
                    {message}
                </Text>
            </ImageBackground>
            <Text>
                Developed by PhantomLabs
            </Text>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        fontSize: 23,
        alignSelf: 'flex-end',
        color: '#ffbd59',
        alignContent: 'center',
        borderRadius:10,
        marginBottom: 5,
        marginLeft:5,
        backgroundColor: '#ffbd59',
        padding: 10
    },
    punch: {
        fontSize: 20,
        marginBottom: 40,
        marginTop: 10,
        color: '#ff1616',
 
    },
    input: {
        borderRadius: 10,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#bbb',
        backgroundColor: '#eee',
        fontSize: 20
    },
    actions: {
        flexDirection: 'row',
        marginBottom: 100,
        justifyContent: 'space-between'
    },
    logo: {
        flex: 1,
        width: '100%',
        height: '100%',

    },
    logoContainer: {
        flexBasis: "50%",
        width: '100%',
        height: '100%',

    },

    button: {
        fontSize: 44,
        color: '#ffbd59',
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20
    }
});
