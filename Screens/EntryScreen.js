import React, { useState } from 'react';
import { LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import logo from './../assets/tow_logo.png'
import background from './../assets/background.png';
var _ = require("underscore");

export default function EntryScreen({ navigation }) {

    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");

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

            <Text style={styles.punch}>
                Enter your pin to start
            </Text>
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

                    if (("" + code).length >= 5) {

                        try {

                        firebase.database.ref("1/people/" + code + "/profile")
                        .once('value', snap => {
                            console.log(snap.val());
                            var data = snap.val();
                            if (data) {
                              
                                navigation.navigate('Dashboard', { 
                                    pin: code, 
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
                }}
            />
            <Text style={styles.punch}>
                {message}
            </Text>
            </ImageBackground>

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
    punch: {
        fontSize: 20,
        marginBottom: 40,
        marginTop: 10,
        color: '#ff1616'
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
