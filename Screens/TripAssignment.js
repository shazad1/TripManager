import React from 'react';
import { ScrollView, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity, ShadowPropTypesIOS } from 'react-native';
import firebase from './../Backend/firebase';
import background from './../assets/background.png';
import { useStore } from "../Store";


export default function TripAssignmentScreen({ navigation, route }) {

    const [state, actions] = useStore();


    LogBox.ignoreAllLogs(true);
    console.log("reached");

    function handleAssignment() {

        console.log("reacehd")
        // make the name
        var dt = new Date();

        var datePart = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        var tripName = state.selectedDriver.name;
        tripName += "-" + state.selectedTruck.regNo;
        tripName += "-" + datePart;

        const now = new Date();
        const number = (Math.round(now.getTime()/10)%160000000000);

        let mileposts = {};
        const types = ["at pickup", "at dropoff", "in midway"]

        let offset = 0;
        state.selectedThings.map((thing, index) => {

            if (index == 1) {
                offset = types.length;
            }

            if (index == 2) {
                offset = 2 * (types.length);
            }

            for (let a = offset; a < (types.length + offset); a++) {
                mileposts[a] = {
                    id: a,
                    itemNumber: thing.itemNumber,
                    name: "Pictures of Item " + (index + 1) + " " + thing.type + " " + types[(a - offset)],
                    type: "pictures",
                    pictures: (thing.itemNumber == 1 ? {
                        1: {
                            number: 1
                        },
                        2: {
                            number: 2
                        },
                        3: {
                            number: 3
                        },
                        4: {
                            number: 4
                        },
                        5: {
                            number: 5
                        },
                        6: {
                            number: 6
                        },
                        7: {
                            number: 7
                        },
                        8: {
                            number: 8
                        },
                        9: {
                            number: 9
                        }
                    } : {
                        1: {
                            number: 1
                        },
                        2: {
                            number: 2
                        },
                        3: {
                            number: 3
                        },
                        4: {
                            number: 4
                        },
                        5: {
                            number: 5
                        }
                    }
                    )
                }
            }

        });

    
        firebase.database
            .ref("1/people/" + state.selectedDriver.pin +
                "/trips/" + number).set({
                    name: number,
                    status: "active",
                    truck: state.selectedTruck.name,
                    driver: state.selectedDriver.name,
                    pin: state.selectedDriver.pin,
                    mileposts: mileposts,
                    thingsToCarry: state.selectedThings,
                    config: state.selectedConfig,
                    tripCode: number
                }),

            navigation.navigate('Dashboard', {})
    }

    return (<View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>


            <ImageBackground source={background} style={styles.container} resizeMode="cover">

                <Text style={styles.punch}>
                    You are Assigning a tow trip for the truck:
                </Text>
                <Text style={styles.hiMsg}>
                    {state.selectedTruck.name} {state.selectedTruck.regNo}
                </Text>
                <Text style={styles.punch}>
                    to driver
                </Text>
                <Text style={styles.hiMsg}>
                    {state.selectedDriver.name} {state.selectedDriver.mobile}
                </Text>
                <Text style={styles.punch}>
                    Truck is carry the follwing perticulars
                </Text>
                {(state.selectedThings || []).map((thing, index) => (

                    <Text style={styles.hiMsg}>
                        Item {index + 1}: {thing.type} for {thing.client} from {thing.pickup} to {thing.dropoff}
                    </Text>))}

                <TouchableOpacity style={styles.goButton}
                    onPress={() => {
                        handleAssignment()
                    }

                    }
                >
                    <Text>
                        Assign
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </ScrollView>
        <View style={styles.actions}>
            {selectedTruck ? (<TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('NumberOfThings', {})
                }}
            >
                <Text>
                    Next
                </Text>

            </TouchableOpacity>) : null}
            <TouchableOpacity style={styles.tripButton}
                onPress={() => {
                    navigation.navigate('Dashboard', {})
                }}
            >
                <Text>
                    Back
                </Text>
            </TouchableOpacity>
        </View>
    </View>)

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',

        justifyContent: 'center'
    },
    actions: {
        flexDirection: 'row-reverse',

        justifyContent: 'space-between'
    },
    scrollContainer: {

        height: '70%',

    },
    introCard: {
        marginTop: '2%',
        marginBottom: '2%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'white',
        width: '95%',
        shadowColor: "#ff0000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
    introCardSelected: {
        marginTop: '2%',
        marginBottom: '2%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'rgba(0,200,0, 0.2)',
        width: '95%',
        shadowColor: "#ff0000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
    punch: {
        fontSize: 20,
        marginBottom: 40,
        marginTop: 10,
        color: '#ffbd59',
        paddingLeft: 10
    },

    hiMsg: {
        fontSize: 15,
        marginBottom: 15,
        fontWeight: '800',
        color: '#ff1616',
        alignSelf: 'center',
        paddingLeft: 15
    },
    secondLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    trips: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    oldTrips: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    input: {
        flexBasis: '80%',
        fontSize: 30,
        marginLeft: 10
    },
    heading: {
        color: '#ff1616',
        fontSize: 15,
    },
    para: {
        color: '#ffbd59',
        fontSize: 15,
    },
    inforLet: {
        flexDirection: 'column',
        margin: 10,
        borderLeftWidth: 8,
        borderLeftColor: '#ffbd59',
        paddingLeft: 10
    },

    tripButton: {
        fontSize: 44,
        color: '#ffbd59',
        width: '35%',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20
    },
    goButton: {
        fontSize: 44,
        color: '#ffbd59',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20,
        marginRight: 10
    }


});