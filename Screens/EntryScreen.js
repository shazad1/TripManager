import React, { useState } from 'react';
import { LogBox, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';

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
            <Text style={styles.punch}>
                Enter the Game Pin {message}
            </Text>
            <SmoothPinCodeInput
                placeholder="⭑"
                cellSize={46}
                codeLength={5}
                cellStyle={{
                    borderWidth: 2,
                    borderRadius: 15,
                    borderColor: 'mediumturquoise',
                    backgroundColor: 'azure',
                }}
                cellStyleFocused={{
                    borderColor: 'lightseagreen',
                    backgroundColor: 'lightcyan',
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
                    setMessage((""+code));
                    if ((""+code).length >= 5) {
                        navigation.navigate('Gallery', { player: 'guest' })
                    }
                }}
            />
            <Text style={styles.punch}>
                OR
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    let randomPin = Math.floor(Math.random()*90000) + 10000;
                    game.pin = randomPin;
                    firebase.gamesRef.push(game)
                        .then(res => {
                            setPin(randomPin); navigation.navigate('Gallery', { pin: pin })
                        },
                            error => {
                                setPin(code); navigation.navigate('Gallery', { pin: error })
                            }
                        )
                }}
            >
                <Text>Create a new Game</Text>
            </TouchableOpacity>


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    punch: {
        fontSize: 20,
        marginBottom: 40,
        marginTop: 40,
        color: 'salmon'
    },
    button: {
        fontSize: 44,
        color: 'salmon',
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'mediumturquoise',
        backgroundColor: 'mediumturquoise',
        padding: 20
    }
});
