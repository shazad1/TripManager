import React, { useEffect, useState } from 'react';
import background from './../assets/background.png';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { ScrollView, SafeAreaView, TextInput, Alert, Image, LogBox, StyleSheet, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import firebase from './../Backend/firebase';
import { Camera } from 'expo-camera'

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


    useEffect(() => {
        (async () => {
            firebase.database
            .ref("1/people/" + pin + 
                "/trips/"+trip.name)
            .on('value', snapshot => {

                let tripDetails = snapshot.val();
                console.log(tripDetails);
                setMileposts(tripDetails.mileposts);

                })
                
        })();
    }, []);
    


    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        console.log(status)
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }
    const __takePicture = async () => {
        const photo = await camera.takePictureAsync({
            base64: true,
            quality: 1
        });

        let pictureUpload = {
          
        };

        console.log(currentPicDest);

      //  pictureUpload[  'picture'+currentPicDest.picNumber] = `data:image/jpeg;btrip.namease64,${photo.base64}`;

        firebase.database
        .ref("1/people/" + pin + 
            "/trips/"+trip.name+"/mileposts/"+currentPicDest.milepost_id+"/pictures/")
            .child(currentPicDest.picNumber).set(
                `data:image/jpeg;base64,${photo.base64}`
            );
            
        


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


                    <ImageBackground source={background} style={styles.container} resizeMode="cover">
                        {trip.mileposts?.map((milepost) => {
                            return (
                                <View style={styles.postCard}>
                                    <Collapse>
                                        <CollapseHeader style={styles.postHeader}>
                                            <View>
                                                <Text style={styles.postHeadline}>{milepost.name}</Text>
                                            </View>
                                        </CollapseHeader>
                                        <CollapseBody>
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
                                                                    <Image style={styles.image} 
                                                                    
                                                                    
                                                source={{ uri: mileposts[milepost.name]?.pictures[pic] }} >
                                                                    </Image>

                                                                    <TouchableOpacity
                                                                        style={styles.picButton}
                                                                        onPress={ () => { 

                                                                            setCurrentPicDest({
                                                                                milepost_id : milepost.id, 
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
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    postHeadline: {
        color: '#ff1616',
        fontSize: 20,
    },
    postCard: {
        marginTop: '10%',
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