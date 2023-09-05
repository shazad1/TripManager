import React, { useState } from 'react';
import { LogBox, StyleSheet, ImageBackground, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import logo from './../assets/punch_pic.png'
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from "../Store";

var _ = require("underscore");

export default function EntryScreen({ navigation }) {

    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [forgetPinClicked, setForgetPinClicked] = useState(false);
    const [state, actions] = useStore();

    var game = {
        pin: 0,
        hostName: '',
        dateCreated: Date.now()
    };

    LogBox.ignoreAllLogs(true);



    return (
        <View style={styles.container}>
            <LinearGradient colors={['#061933', '#4f74a8', '#061933']} style={styles.linearGradient}>
                {/* <ImageBackground source={background} style={styles.container} resizeMode="cover"> */}
                <View style={styles.logoContainer}>
                    <ImageBackground source={logo} resizeMode="cover"
                        style={styles.logo}>
                    </ImageBackground>
                </View>

                {forgetPinClicked == false ? (<View style={styles.loginContainer}>
                    <View style={[styles.actions]}>

                        <SmoothPinCodeInput
                            placeholder="⭑"
                            cellSize={56}
                            codeLength={6}
                            cellStyle={{
                                borderWidth: 2,
                                borderRadius: 15,
                                borderColor: '#e4581e',
                                backgroundColor: 'azure',
                            }}
                            cellStyleFocused={{
                                borderColor: '#e4581e',
                                backgroundColor: '#e4581e',
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

                    </View>
                    <TouchableOpacity
                            style={styles.actionButton}

                            onPress={() => {


                                try {
                                    console.log(pin);
                                    firebase.database.ref("1/drivers/" + pin)
                                        .once('value', snap => {
                                            console.log(snap.val());
                                            var data = snap.val();
                                            if (data) {

                                                actions.updateCurrntUser(data.name, data.email, data.role || 'driver');

                                                navigation.navigate('Dashboard', {
                                                    pin: pin,
                                                    driver: data.name,
                                                    role: data.role || 'driver'
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
                            <Text style={styles.actionButtonText} >Enter</Text>
                        </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.passiveButton}
                        onPress={() => {
                            setForgetPinClicked(true)
                        }}
                    >

                        <Text style={styles.passiveButtonText}>
                            I forget My Pin
                        </Text>
                    </TouchableOpacity>
                </View>) :
                    (<View style={styles.loginContainer}>

                        <View style={[styles.actions]}>

                            <SafeAreaView>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                    }}
                                    value={email}
                                    placeholder="enter email registered with the account"

                                />
                            </SafeAreaView>

                        </View>
                        <TouchableOpacity
                                style={styles.actionButton}

                                onPress={async () => {
                                    let response = await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/onForgetPin?email=" + email);
                                    console.log(response);
                                }}

                            >
                                <Text style={styles.actionButtonText}>Email Pin</Text>
                            </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.passiveButton}
                            onPress={() => {
                                setForgetPinClicked(false)
                            }}
                        >
                            <Text style={styles.passiveButtonText}>
                                I know my Pin
                            </Text>
                        </TouchableOpacity>
                    </View>)}
                <Text style={styles.punch}>
                    {message}
                </Text>

                {/* </ImageBackground> */}

                <Text style={styles.punch}>
                    By logging into this application you are acknowledging the fact that this application provides a mean to manage and track the trip progress.
                    The application is not responsible to ensure the safety and quality of freight towed by truck or any damage caused by any accident or negligence caused by driver of the truck

                    version: 1.0.1
                </Text>
            </LinearGradient>
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
    loginContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linearGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    actionButton: {
        fontSize: 50,

        color: '#516273',
        alignContent: 'stretch',
        borderRadius: 10,
        marginBottom: 35,
        marginTop: 15,
        marginLeft: 5,
        backgroundColor: '#e4581e',
        paddingVertical: 10,
        paddingLeft: 100,
        paddingRight: 100
    },
    passiveButton: {
        fontSize: 50,

        color: '#e4581e',
        alignContent: 'stretch',
        borderRadius: 10,
        marginBottom: 35,
        marginTop: 15,
        marginLeft: 5,
        borderColor: '#e4581e',
        borderWidth: 1,
        paddingVertical: 10,
        paddingLeft: 100,
        paddingRight: 100
    },
    actionButtonText: {
        fontSize: 25
    },
    passiveButtonText: {
        fontSize: 25,
        color: '#e4581e'
    },
    note: {
        paddingLeft: 10,
        fontSize: 10,
    },
    punch: {
        fontSize: 13,
        paddingHorizontal:5,
        marginBottom: 40,
        color: '#e4581e',

    },
    input: {
        borderRadius: 10,
        alignSelf: 'center',
        borderWidth: 2,
        color: '#e4581e',
        borderColor: '#e4581e',
        backgroundColor: '#eee',
        paddingHorizontal:10,
        fontSize: 20
    },
    gap: {
        marginTop: 30,
        marginBottom: 100
    },
    actions: {
        flexDirection: 'row',

        justifyContent: 'space-between'
    },
    logo: {
        flex: 0,
        width: '100%',
        height: '100%',

    },
    logoContainer: {
        flexBasis: "50%",
        width: '100%',
        height: '70%',

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
