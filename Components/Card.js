import React, { useState } from 'react';
import { LogBox, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from "../Store";

export default function Card(props) {

    const { navigation, position } = props;
    const [state, actions] = useStore();
    const card = state.cards[position];
    console.log("State Changed");
    let cardGraphic = '';

    if (card.face == 'diamond') {
        cardGraphic = require("./../assets/diamond.png");
    }
    if (card.face == 'gold') {
        cardGraphic = require("./../assets/gold.png");
    }

    if (card.face == 'silver') {
        cardGraphic = require("./../assets/silver.png");
    }
    if (card.face == 'pearl') {
        cardGraphic = require("./../assets/pearl.png");
    }

    LogBox.ignoreAllLogs(true);

    return (
        <View style={styles.container}>


            <TouchableOpacity
                style={card.state == 'rest' ? styles.restCard : (card.state == 'raised' ? styles.raisedCard : styles.dispatchedCard)}
                onPress={() => {
                    actions.changeCardState(position);
                }
                }>
                <ImageBackground source={cardGraphic} resizeMode="cover"
                    style={card.state == 'rest' ? styles.restCard : (card.state == 'raised' ? styles.raisedCard : styles.dispatchedCard)}>
                </ImageBackground>
            </TouchableOpacity>


        </View >

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    restCard: {
        flex: 1,
        width: 80,
        height: 100,
        justifyContent: "center",
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 3,
    },
    raisedCard: {
        flex: 1,
        width: 80,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        justifyContent: "center",
        alignSelf: 'center',
        backgroundColor: 'lightgreen',
        zIndex: 10,
    },
    dispatchedCard: {
        flex: 1,
        width: 80,
        height: 100,
        justifyContent: "center",
        alignSelf: 'center',
        backgroundColor: 'red'
    }
});
