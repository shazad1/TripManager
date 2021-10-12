import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from 'react-native';


export default function GalleryScreen({ navigation, route }) {
    const [nickname, setNickName] = useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.punch}>
                You have been invited to game. Please enter the nickname you wish to use
            </Text>

            <SafeAreaView style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setNickName(text);
                    }}
                    value={nickname}
                    placeholder="pick a nickname"

                />
            </SafeAreaView>
            <View style={styles.buttonSet}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('Game', { nickname })
                    }}
                >
                    <Text>Enter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        ;
                    }}
                >
                    <Text>Exit</Text>
                </TouchableOpacity>
            </View>

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
    buttonSet: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    punch: {
        fontSize: 25,
        margin: '10%',
        color: 'salmon'
    },
    punchlet: {
        fontSize: 20,
        color: 'salmon'
    },
    input: {
        height: 60,
        width: '75%',
        fontSize: 30,
        marginBottom: 40,
        marginTop: 40,
        color: 'salmon',
        margin: 6,
        borderColor: 'mediumturquoise',
        borderWidth: 1,
        padding: 10,
    },
    inputArea: {
        height: 40,
        width: '100%',
        margin: 6,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        fontSize: 44,
        color: 'salmon',
        borderWidth: 2,
        borderRadius: 15,
        borderColor: 'mediumturquoise',
        backgroundColor: 'mediumturquoise',
        padding: 20,
        margin: 50
    }


});