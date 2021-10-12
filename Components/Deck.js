// Deck is the component that is going to deal with in and out of cards the ability of card to respond to user click event 
// is sitll going to be part of card component but all the rules governing the interaction between user and the cards will be 
// the part of the deck/

// Deck is going to receive an information about what cards are to be displayed
// Deck is going to receive an information about what what card user has received
// Deck is going to communicate what card user has selected to dispose

// So cards are just going to be childern of deck

import React, { useState } from 'react';
import { LogBox, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Card from './Card';
import { useStore } from "../Store";


export default function Deck(props) {

    const { navigation } = props;
    const [state, actions] = useStore();

    const cards = state.cards;

    LogBox.ignoreAllLogs(true);

    return (
        <View style={styles.container}>
                {cards[1].face !== 'none' && <Card position = {1}></Card>}
                {cards[2].face !== 'none' && <Card position = {2}></Card>}
                {cards[3].face !== 'none' && <Card position = {3}></Card>}
                {cards[4].face !== 'none' && <Card position = {4}></Card>}
                {cards[5].face !== 'none' && <Card position = {5}></Card>}
        </View >

    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis:'15%',
        flexDirection: 'row'
    }
});
