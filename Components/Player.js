import React, { useState, useEffect } from 'react';
import { LogBox, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import firebase from './../Backend/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from "../Store";

export default function Player(props) {



    const [state, action] = useStore();
    const [pulse, setPulse] = useState(1);

    var player = { nickName: "", turn: false };

    for (let i = 1; i <= 4; i++) {
        if (state.players[i].position == props.position) {
            player = state.players[i];
            break;
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            heartBeat();
        }, 500);
        return () => clearInterval(interval);
    });

    LogBox.ignoreAllLogs(true);

    function heartBeat() {
        if (player.turn && pulse == 0) {
            setPulse(1);
            console.log(pulse)
        }
        if (player.turn && pulse == 1) {
            setPulse(0);
            console.log(pulse)
        }

    }

    return (

        <View style={[styles.container, (pulse == 1 ? styles.show : styles.noShow) ]}>

                <Ionicons style={styles.icon} name="person" size={76} color={props.color} />
                <Text style={styles.icon}>{player.nickName}</Text>
         
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,

    },
    show: {
        opacity: 1
    },
    noShow: {
        opacity: 0
    },
    icon: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 3,
    }
});
