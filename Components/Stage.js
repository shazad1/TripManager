import React, { useState } from 'react';
import { LogBox, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Deck from './Deck';
import Player from './Player';
import { useStore } from "../Store";

export default function Stage({ navigation }) {

    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");
    const [state, action] = useStore();

    const thisPlayer = state.thisPlayer;
    const players = state.players;

    if (thisPlayer == 1) {
        players[1].position = 'bottom';
        players[2].position = "right";
        players[4].position = "left";
        players[3].position = "top";

    } else if (thisPlayer == 2) {
        players[2].position = 'bottom';
        players[3].position = "right";
        players[1].position = "left";
        players[4].position = "top"; 
    } else if (thisPlayer == 3) {
        players[3].position = 'bottom';
        players[4].position = "right";
        players[2].position = "left";
        players[1].position = "top"; 
    } else if (thisPlayer == 4) {
        players[4].position = 'bottom';
        players[1].position = "right";
        players[3].position = "left";
        players[2].position = "top"; 
    }
    LogBox.ignoreAllLogs(true);

    return (
        <View style={styles.contaianer}>
            <View style={styles.table}>
                {
                    [1, 2, 3, 4, 5].map((row) => (
                        <View key={row} style={styles.row}>
                            {[6, 7, 8, 9, 10].map(col => <View style={styles.box} key={col}>
                                {(col == 6 && row == 3) && <Player color="red" position = "top" ></Player>}
                                {(col == 7 && row == 2) && <MaterialCommunityIcons name="check-outline" size={54} color="green" />}
                                {(col == 7 && row == 4) && <MaterialCommunityIcons name="arrow-bottom-right-bold-outline" size={54} color="black" />}
                                {(col == 8 && row == 1) && <Player color="green" position = "left" ></Player>}
                                {(col == 8 && row == 5) && <Player color="blue" position = "right" ></Player>}
                                {(col == 9 && row == 2) && <MaterialCommunityIcons name="arrow-top-left-bold-outline" size={54} color="black" />}
                                {(col == 9 && row == 4) && <MaterialCommunityIcons name="arrow-bottom-left-bold-outline" size={54} color="black" />}
                                {(col == 10 && row == 3) && <Player color="yellow" position = "bottom" ></Player>}
                            </View>)}
                        </View>
                    ))

                }

            </View>
                <Deck></Deck>
        </View>

    );
}

const styles = StyleSheet.create({
    contaianer: {
        flexDirection: 'column'
    },
    table: {
        marginTop: 20,
        padding: 10,
        width: 400,
        height: 500,
        flexDirection: 'row'
    },
    cards: {
        margin: 10,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis:'15%',
        borderWidth:1,
        flexDirection: 'row'
    },
    row: {

        width: '100%',
        flex: 1,
        justifyContent: 'space-around'
    },
    box: {
        alignSelf: 'center',
        justifyContent: 'center',

        flex: 1
    },
    coloredBox: {
        flex: 1,
        backgroundColor: 'red'
    }
});
