import React, { useEffect, useState } from 'react';
import background from './../assets/background.png';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { ScrollView, SafeAreaView, TextInput, Alert, Image, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import firebase from './../Backend/firebase';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

let camera;

export default function TripScreen({ navigation, route }) {

    let trip = route.params.trip;
    let pin = route.params.pin;
    const [searchText, setSearchText] = useState('');
    const [startCamera, setStartCamera] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = useState('off');
    const [currentPicDest, setCurrentPicDest] = useState({});
    const [mileposts, setMileposts] = useState([]);
    const [textLocation, setTextLocation] = useState("");


    useEffect(() => {
        (async () => {
            firebase.database
                .ref("1/people/" + pin +
                    "/trips/" + trip.name)
                .on('value', snapshot => {
                    console.log("updated");
                    let tripDetails = snapshot.val();
                    setMileposts(tripDetails.mileposts);

                })

        })();
    }, []);




    const __startCamera = async () => {
        try {

            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');

            }

            let location = await Location.getCurrentPositionAsync({});
            let latLong = {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude
            };


            let textLoc = await Location.reverseGeocodeAsync(latLong);
            console.log(textLoc);
            setTextLocation({
                city: textLoc[0]?.city,
                region: textLoc[0]?.region,
                street: textLoc[0]?.street,
                subRegion: textLoc[0]?.subregion,
                postCode: textLoc[0]?.postalCode
            });

        } catch (ex) {
            console.log(ex);
        }

        let { status } = await Camera.requestPermissionsAsync();
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Camera Access denied')
        }
    }
    const __takePicture = async () => {
        const photo = await camera.takePictureAsync({
            quality: 0.3
        });

        let pictureUpload = {

        };



        //  pictureUpload[  'picture'+currentPicDest.picNumber] = `data:image/jpeg;btrip.namease64,${photo.base64}`;

        firebase.database
            .ref("1/people/" + pin +
                "/trips/" + trip.name + "/mileposts/" + currentPicDest.milepost_id + "/pictures/")
            .child(currentPicDest.picNumber).set({
                path: pin + "/" + trip.name + "/" + currentPicDest.milepost_id + "/picture" + currentPicDest.picNumber + ".jpg",
                location: (textLocation.city + " " + textLocation.region + " " + textLocation.subRegion + " " + textLocation.street + " " + textLocation.postCode),
                date: (new Date()).toString(),
                number: currentPicDest.picNumber
            }

            );
        let resp = await fetch(photo.uri);
        let blob = await resp.blob();

        firebase.storage.ref().child(pin + "/" + trip.name + "/" + currentPicDest.milepost_id + "/picture" + currentPicDest.picNumber + ".jpg")
            .put(blob)
            .then((snapshot) => {
                //You can check the image is now uploaded in the storage bucket
                console.log(`has been successfully uploaded.`);
            })
            .catch((e) => console.log('uploading image error => ', e));


        setStartCamera(false);
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



    return (
        <View style={styles.container}>
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
                                                bottom: 0,
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Camera>
                    )}
                </View >
            )
                :
                (
                    <ScrollView >

                        <ImageBackground source={background} style={styles.container} resizeMode="cover">
                            {mileposts?.map((milepost) => {
                                return (
                                    <View style={styles.postCard}>
                                        <Collapse>
                                            <CollapseHeader style={styles.postHeader}>
                                                <View>
                                                    <Text style={styles.postHeadline}>{milepost.name}</Text>
                                                </View>
                                            </CollapseHeader>
                                            <CollapseBody style={styles.postBody}>
                                                {
                                                    milepost.type == 'pictures&reading' ? (
                                                        <View style={styles.actions}>
                                                            <SafeAreaView>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    onChangeText={(text) => {
                                                                        setSearchText(text);
                                                                    }}
                                                                    value={searchText}
                                                                    placeholder="enter value"

                                                                />
                                                            </SafeAreaView>
                                                            <TouchableOpacity
                                                                style={styles.picButton}
                                                            >
                                                                <Text>Take Photo</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    ) : (
                                                        <View >
                                                            {[1, 2, 3, 4].map((pic) => {

                                                                return (
                                                                    <View style={styles.actions}>
                                                                        {milepost.pictures && milepost.pictures[pic] ? (
                                                                            <MaterialCommunityIcons style={styles.icon} name="check-outline" size={34} color="green" />
                                                                        ) : null}

                                                                        <TouchableOpacity
                                                                            style={styles.picButton}
                                                                            onPress={() => {

                                                                                setCurrentPicDest({
                                                                                    milepost_id: milepost.id,
                                                                                    picNumber: pic
                                                                                });


                                                                                __startCamera();
                                                                            }}

                                                                        >
                                                                            <Text>Take Photo {pic}</Text>
                                                                        </TouchableOpacity >
                                                                    </View>)
                                                            })}
                                                        </View>
                                                    )
                                                }
                                            </CollapseBody>
                                        </Collapse>
                                    </View>
                                )
                            })}

                        </ImageBackground>
                        <View style={styles.reportButtons}>
                            <TouchableOpacity
                                style={styles.picButton}
                                onPress={async() => {

                                    await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/createTripReport");
                                }}

                            >
                                <Text>Generate Report </Text>
                            </TouchableOpacity >
                            <TouchableOpacity
                                style={styles.picButton}
                                onPress={async () => {

                                    await fetch("https://asia-southeast2-tawtripmanager.cloudfunctions.net/createTripInvoice");
                                }}

                            >
                                <Text>Generate Invoice </Text>
                            </TouchableOpacity >
                        </View>
                    </ScrollView>
                )


            }

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

        justifyContent: 'flex-start'
    },
    reportButtons: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',

    },
    postHeadline: {
        color: '#ff1616',
        padding: 10,
        fontSize: 20,
    },
    postBody: {
        color: '#ff1616',
        padding: 10,

    },
    icon: {
        alignSelf: 'center',
        marginLeft: 50
    },
    postCard: {
        marginTop: '15%',
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 189, 89, 0.3)',
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
    picButton: {
        fontSize: 44,
        alignSelf: 'flex-end',
        width: '50%',
        color: '#ffbd59',
        marginBottom: 5,
        borderColor: 'mediumturquoise',
        backgroundColor: '#ffbd59',
        padding: 20,
        marginRight: 10
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        fontSize: 30,
        marginLeft: 10
    },
    image: {
        width: 80,
        height: 60,
        borderWidth: 2

    }
});