import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Stage from './../Components/Stage';


export default function GameScreen({ navigation, route }) {
    const [nickname, setNickName] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.board}>
               <ImageBackground source={require("./../assets/wooden.png")} resizeMode="cover" style={styles.image}> 
                    <Stage>

                    </Stage>
               </ImageBackground> 

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
    board: {
        margin: 56,
        borderWidth: 1,
        width: '98%',
        height: '98%',
        borderColor: 'mediumturquoise',
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