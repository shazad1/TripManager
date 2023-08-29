import React, { useState, useEffect } from 'react';
import { ScrollView, LogBox, StyleSheet, Image, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Progress from 'react-native-progress';
import firebase from './../Backend/firebase';

import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from "../Store";

var _ = require("underscore");

export default function YardEntryChassisScreen({ navigation }) {

    const [pin, setPin] = useState("");
    const [startCamera, setStartCamera] = useState(false)
    const [things, setThings] = useState([])
    const [selectedChassis, setSelectedChassis] = useState("");
    const [selectedThing, setSelectedThing] = useState(null);
    const [forgetPinClicked, setForgetPinClicked] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = useState('off');
    const [currentPicDest, setCurrentPicDest] = useState({});
    const [uploadProgress, setUploadProgress] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [state, actions] = useStore();
    let camera;


    LogBox.ignoreAllLogs(true);
    useEffect(() => {
        (async () => {
            try {
                firebase.database.ref("1/things")
                    .orderByChild('status').equalTo('in service')
                    .on('value', snapshot => {
                        let things = [];
                        snapshot.forEach(function (snp) {
                            things.push(snp.val());
                        });


                        setThings(things);
                        console.log(things);

                    })

            } catch (ex) {
                console.log(ex);
            }


        })();
    }, []);

    const __startCamera = async () => {


        let { status } = await Camera.requestCameraPermissionsAsync();

        if (status === 'granted') {
            const res = await MediaLibrary.requestPermissionsAsync()

            if (status === 'granted') {
                setStartCamera(true)
            }

        } else {
            Alert.alert('Camera Access denied')
        }
    }
    const __takePicture = async () => {

        setUploadProgress(true);
        const photo = await camera.takePictureAsync({
            quality: 0.3
        });

        await MediaLibrary.saveToLibraryAsync(photo.uri)
        let pictureUpload = {

        };



        //  pictureUpload[  'picture'+currentPicDest.picNumber] = `data:image/jpeg;btrip.namease64,${photo.base64}`;

        firebase.database
            .ref("1/inyard/" + state.selectedClient.pin + "/" + (selectedChassis)).set({
                chassis: selectedChassis,
                client: state.selectedClient.pin,
                type: selectedThing.name,
                path: "inyard/" + state.selectedClient.pin + "/" + (selectedChassis) + "/" + currentPicDest.picNumber + ".jpg",
                date: (new Date()).toString()
            }
            );




        setPhotoUrl(photo.uri)
        let resp = await fetch(photo.uri);

        let blob = await resp.blob();

        firebase.storage.ref().child("inyard/" + state.selectedClient.pin + "/" + (selectedChassis) + "/" + currentPicDest.picNumber + ".jpg")
            .put(blob)
            .then((snapshot) => {
                //You can check the image is now uploaded in the storage bucket
                console.log(`has been successfully uploaded.`);
                setUploadProgress(false);
                setStartCamera(false);
            })
            .catch((e) => {
                console.log('uploading image error => ', e)
                setUploadProgress(false);
                setStartCamera(false);
            }
            );

    }
    const __savePhoto = () => { }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    const __switchCamera = () => {
        if (cameraType === 'back') {
            setCameraType('front')
        } else {
            setCameraType('back')
        }
    }

    return (<View style={styles.container}>
        {startCamera == true ? (
            <View
                style={{
                    flex: 1,
                    width: '100%'
                }}
            >
                {previewVisible && capturedImage ? (
                    <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                ) : (
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        style={{ flex: 1 }}
                        ref={(r) => {
                            camera = r
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: 'transparent',
                                flexDirection: 'row'
                            }}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    left: '5%',
                                    top: '10%',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {uploadProgress ? (<Progress.Pie size={100} indeterminate={true}
                                    progress={uploadProgress}
                                    thickness={135}
                                    color='#ffbd59'
                                    style={styles.progress}
                                ></Progress.Pie>) : null}
                                <TouchableOpacity
                                    onPress={__handleFlashMode}
                                    style={{
                                        backgroundColor: flashMode === 'off' ? '#000' : '#fff',

                                        height: 25,
                                        width: 25
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20
                                        }}
                                    >
                                        ⚡️
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={__switchCamera}
                                    style={{
                                        marginTop: 20,
                                        height: 25,
                                        width: 25
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20
                                        }}
                                    >
                                        {cameraType === 'front' ? '🤳' : '📷'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    flexDirection: 'row',
                                    flex: 1,
                                    width: '100%',
                                    padding: 20,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <View
                                    style={{
                                        alignSelf: 'center',
                                        flex: 1,
                                        alignItems: 'center'
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={__takePicture}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            bottom: 0,
                                            backgroundColor: '#ffbd59'
                                        }}
                                    >
                                        <Text>Click</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Camera>
                )}
            </View >
        ) : (
            <View style={styles.container}>

                <View style={styles.scrollContainer}>
                    <LinearGradient colors={['#061933', '#4f74a8', '#061933']} style={styles.linearGradient}>
                        <Text style={styles.punch}>Select the Type, enter Chassis and take a photo! </Text>
                        <View style={styles.options}>

                            {things?.map((thing) => {
                                return (

                                    <TouchableOpacity style={selectedThing?.name == thing.name ? styles.introCardSelected : styles.introCard}
                                        onPress={() => {
                                            setSelectedThing(thing)
                                        }

                                        }
                                    >
                                        <Text style={styles.tripButtonText}>
                                            {thing.name}
                                        </Text>
                                    </TouchableOpacity>

                                )
                            })}
                        </View>
                        {selectedThing && <View style={styles.chassisContainer}>

                            <View style={[styles.actions]}>

                                <SafeAreaView>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            setSelectedChassis(text.replace(/^\s+|\s+$/gm, ''));
                                        }}
                                        value={selectedChassis}
                                        placeholder="Enter the Chassis Number"

                                    />
                                </SafeAreaView>


                            </View>

                        </View>}

                        {selectedChassis != "" && <TouchableOpacity
                            style={styles.tripButton}
                            onPress={() => {

                                setCurrentPicDest({
                                    picNumber: 1
                                });


                                __startCamera();
                            }}

                        >
                            <Text style={styles.tripButtonText}>Take Photo</Text>
                        </TouchableOpacity >}

                        <Image
                            source={{ uri: photoUrl }}
                            style={{width: '50%', height: '25%', alignSelf: "center"}}
                        />

                    </LinearGradient>
                </View>

            </View>)}
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
    chassisContainer: {
        marginTop: '10%',
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

    tripButton: {
        fontSize: 44,
        color: '#e4581e',
        width: '95%',
        marginBottom: 5,
        marginTop: 15,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#061933',

    },
    introCard: {
        margin: '2%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'white',
        width: '95%',
        shadowColor: "transparent",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
    introCardSelected: {
        margin: '2%',

        flexDirection: 'column',
        justifyContent: 'center',
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
        fontSize: 20,
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 10,
        marginBottom: 40,
        color: '#e4581e',
        paddingLeft: 10
    },
    input: {
        borderRadius: 10,
        alignSelf: 'center',
        borderWidth: 2,
        color: '#e4581e',
        borderColor: '#e4581e',
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        fontSize: 30
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
    tripButtonText: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: '#e4581e',
        paddingLeft: 10
    },

    button: {
        fontSize: 44,
        color: '#ffbd59',
        borderWidth: 2,
        borderRadius: 25,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20
    },
    scrollContainer: {
        flexDirection: "column",
        height: "100%",
        justifyContent: "center"
    }
});
