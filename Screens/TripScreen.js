import React, { useEffect, useState } from "react";
import background from "./../assets/background.png";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import {
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import firebase from "./../Backend/firebase";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import * as Location from "expo-location";
import { useStore } from "../Store";
import * as Progress from "react-native-progress";
import twobtwo from "./../assets/twobtwo.png";
import twobone from "./../assets/twobone.png";
import twoaone from "./../assets/twoaone.png";
import twoatwo from "./../assets/twoatwo.png";

import threeaone from "./../assets/threeaone.png";
import threeatwo from "./../assets/threeatwo.png";
import threeathree from "./../assets/threeathree.png";

import threebone from "./../assets/threebone.png";
import threebtwo from "./../assets/threebtwo.png";
import threebthree from "./../assets/threebthree.png";

import oneaone from "./../assets/oneaone.png";
import onebone from "./../assets/onebone.png";
import { LinearGradient } from "expo-linear-gradient";
import { style } from "deprecated-react-native-prop-types/DeprecatedImagePropType";

let camera;

let boatAspects = [
  "Front Side",
  "Back Side",
  "Left Side",
  "Right Side",
  "VIN/Chasis",
];

let caravanAspects = [
  "Front Side",
  "Back Side",
  "Left Side",
  "Right Side",
  "VIN/Chasis",
  "Interior Floor",
  "Interior Matress",
  "Interior ceiling",
  "Interior fridge/TV",
  "Main Door Locked after inspection",
];

function getImageForThing(number, numberOfThings, configType) {
  if (numberOfThings == 1 && configType == 0) return oneaone;
  if (numberOfThings == 1 && configType == 1) return onebone;

  if (numberOfThings == 3 && configType == 4 && number == 1) return threeaone;
  if (numberOfThings == 3 && configType == 4 && number == 2) return threeatwo;
  if (numberOfThings == 3 && configType == 4 && number == 3) return threeathree;

  if (numberOfThings == 3 && configType == 5 && number == 1) return threebone;
  if (numberOfThings == 3 && configType == 5 && number == 2) return threebtwo;
  if (numberOfThings == 3 && configType == 5 && number == 3) return threebthree;

  if (numberOfThings == 2 && configType == 2 && number == 1) return twoaone;
  if (numberOfThings == 2 && configType == 2 && number == 2) return twoatwo;

  if (numberOfThings == 2 && configType == 3 && number == 1) return twobone;
  if (numberOfThings == 2 && configType == 3 && number == 2) return twobtwo;
}

const __sendLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    let latLong = {
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    };

    // console.log("reached 97");
    // let textLoc = await Location.reverseGeocodeAsync(latLong);
    // console.log(textLoc);

    // let locatObject = {
    //     city: textLoc[0]?.city,
    //     region: textLoc[0]?.region,
    //     street: textLoc[0]?.street,
    //     subRegion: textLoc[0]?.subregion,
    //     postCode: textLoc[0]?.postalCode
    // };

    firebase.database
      .ref("1/tracks/" + trip.tripCode)
      .child("points")
      .push({
        latLong: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        // location: (locatObject.city + " " + locatObject.region + " " + locatObject.subRegion + " " + locatObject.street + " " + locatObject.postCode),
        date: new Date().toString(),
        task: "background",
      });

    firebase.database
      .ref("1/tracks/" + trip.tripCode)
      .child("pin")
      .set(pin);

    firebase.database
      .ref("1/tracks/" + trip.tripCode)
      .child("tripName")
      .set(trip.name);
  } catch (ex) {
    console.log(ex);
  }
};

var trip = null;
var pin = null;

export default function TripScreen({ navigation, route }) {
  trip = route.params.trip;
  pin = route.params.pin;
  sendData = route.params.sendData;

  const [searchText, setSearchText] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState("off");
  const [currentPicDest, setCurrentPicDest] = useState({});
  const [mileposts, setMileposts] = useState([]);
  const [textLocation, setTextLocation] = useState("");
  const [progress, setProgress] = useState(true);
  const [state, actions] = useStore();
  const [thingsToCarry, setThngsToCarry] = useState(null);
  const [config, setConfig] = useState(null);
  const [expandedMilePost, setExpendedMilepost] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    (async () => {
      actions.updateCurrentTrip(trip);
      actions.updateCurretnPin(pin);

      if (sendData) {
        sendData({
          trip,
          pin,
        });
      }
      RegisterBackgroundTask();

      firebase.database
        .ref("1/people/" + pin + "/trips/" + trip.name)
        .on("value", (snapshot) => {
          let tripDetails = snapshot.val();

          setMileposts(tripDetails.mileposts);
          setThngsToCarry(tripDetails.thingsToCarry);
          console.log(thingsToCarry);
          setConfig(tripDetails.config);

          setProgress(false);
        });
    })();
  }, []);

  const __startCamera = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      let latLong = {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      };

      let textLoc = await Location.reverseGeocodeAsync(latLong);
      console.log(textLoc);
      setTextLocation({
        city: textLoc[0]?.city,
        region: textLoc[0]?.region,
        street: textLoc[0]?.street,
        subRegion: textLoc[0]?.subregion,
        postCode: textLoc[0]?.postalCode,
      });
    } catch (ex) {
      console.log(ex);
    }

    let { status } = await Camera.requestPermissionsAsync();

    if (status === "granted") {
      const res = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        setStartCamera(true);
      }
    } else {
      Alert.alert("Camera Access denied");
    }
  };
  const __takePicture = async () => {
    setUploadProgress(true);
    const photo = await camera.takePictureAsync({
      quality: 0.3,
    });

    await MediaLibrary.saveToLibraryAsync(photo.uri);
    let pictureUpload = {};

    //  pictureUpload[  'picture'+currentPicDest.picNumber] = `data:image/jpeg;btrip.namease64,${photo.base64}`;

    firebase.database
      .ref(
        "1/people/" +
          pin +
          "/trips/" +
          trip.name +
          "/mileposts/" +
          currentPicDest.milepost_id +
          "/pictures/"
      )
      .child(currentPicDest.picNumber)
      .set({
        path:
          pin +
          "/" +
          trip.name +
          "/" +
          currentPicDest.milepost_id +
          "/picture" +
          currentPicDest.picNumber +
          ".jpg",
        location:
          textLocation.city +
          " " +
          textLocation.region +
          " " +
          textLocation.subRegion +
          " " +
          textLocation.street +
          " " +
          textLocation.postCode,
        date: new Date().toString(),
        number: currentPicDest.picNumber,
        aspect: currentPicDest.aspect,
      });

    firebase.database
      .ref("1/people/" + pin + "/trips/" + trip.name + "/progress")
      .once("value", async (snapshot) => {
        let oldProgress = snapshot.val();

        let sum = 0;

        (mileposts || []).map((post) => {
          if (post.name.includes("Caravan")) {
            console.log(post);
            sum += caravanAspects.length;
          } else {
            sum += boatAspects.length;
          }
        });
        console.log(sum);
        let increment = 1 / sum;

        firebase.database
          .ref("1/people/" + pin + "/trips/" + trip.name)
          .child("progress")
          .set(oldProgress + increment);

        if (oldProgress + increment > 0.97) {
          console.log(oldProgress + increment);

          await firebase.database
            .ref("1/people/" + pin + "/trips/" + trip.name)
            .child("stage")
            .set("ended");

          var t2c = trip.thingsToCarry;
          if (t2c && t2c.length > 0) {
            for (let c = 0; c < t2c.length; c++) {
              await firebase.database
                .ref("1/clients/" + t2c[c].clientPin + "/vins/" + t2c[c].chasis)
                .child("stage")
                .set("ended");
            }
          }
        } else {
          firebase.database
            .ref("1/people/" + pin + "/trips/" + trip.name)
            .child("stage")
            .set("enroute");
          var t2c = trip.thingsToCarry;
          if (t2c && t2c.length > 0) {
            for (let c = 0; c < t2c.length; c++) {
              await firebase.database
                .ref("1/clients/" + t2c[c].clientPin + "/vins/" + t2c[c].chasis)
                .child("stage")
                .set("enroute");
              await firebase.database
                .ref("1/clients/" + t2c[c].clientPin + "/vins/" + t2c[c].chasis)
                .child("actualDate")
                .set(new Date().toString());
            }
          }
        }
      });

    let resp = await fetch(photo.uri);

    let blob = await resp.blob();

    firebase.storage
      .ref()
      .child(
        pin +
          "/" +
          trip.name +
          "/" +
          currentPicDest.milepost_id +
          "/picture" +
          currentPicDest.picNumber +
          ".jpg"
      )
      .put(blob)
      .then((snapshot) => {
        //You can check the image is now uploaded in the storage bucket
        console.log(`has been successfully uploaded.`);
      })
      .catch((e) => console.log("uploading image error => ", e));

    await __sendLocation();

    setUploadProgress(false);
    setStartCamera(false);
  };
  const __savePhoto = () => {};
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  if (progress) {
    return (
      <Progress.Pie
        indeterminate={true}
        style={styles.progress}
        size={100}
        color="#ffbd59"
        progress={true}
        thickness={45}
        showsText={true}
      />
    );
  }

  return (
    <View style={styles.container}>
      {startCamera == true ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={__savePhoto}
              retakePicture={__retakePicture}
            />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: "5%",
                    top: "10%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {uploadProgress ? (
                    <Progress.Pie
                      size={100}
                      indeterminate={true}
                      progress={uploadProgress}
                      thickness={135}
                      color="#ffbd59"
                      style={styles.progress}
                    ></Progress.Pie>
                  ) : null}
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === "off" ? "#000" : "#fff",

                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
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
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      {cameraType === "front" ? "🤳" : "📷"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    flexDirection: "row",
                    flex: 1,
                    width: "100%",
                    padding: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        flexDirection: "row",
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        bottom: 0,
                        backgroundColor: "#ffbd59",
                      }}
                    >
                      <Text>Click</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <LinearGradient
          colors={["#061933", "#4f74a8", "#061933"]}
          style={styles.linearGradient}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Entry");
              }}
            >
              <Text style={styles.picButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Entry");
              }}
            >
              <Text style={styles.picButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                __sendLocation();
              }}
            >
              <Text style={styles.picButtonText}>Tap</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {thingsToCarry.map((thing) => {
              return (
                <View style={styles.introCard}>
                  <View style={styles.hiMsg}>
                    <Image
                      source={getImageForThing(
                        thing.itemNumber,
                        thingsToCarry.length,
                        config
                      )}
                      style={styles.single}
                    ></Image>
                  </View>
                  <View>
                    <Text style={styles.picButtonTextLarge}>
                      {""}
                      {thing.client} {" VIN: "} {thing.chasis}
                    </Text>
                    <Text style={styles.picButtonTextLarge}>
                      {"It's item #" + thing.itemNumber + " on the truck "}
                    </Text>
                    <Text style={styles.picButtonTextLarge}>
                      {"It's a " + thing.type}
                    </Text>
                  </View>
                  {(mileposts || []).map((milepost) => {
                    if (milepost.itemNumber == thing.itemNumber)
                      return (
                        <View style={styles.postCard}>
                          <Collapse
                            style={{ paddingTop: 40 }}
                            isExpanded={expandedMilePost == milepost.id}
                            onToggle={() => {
                              setExpendedMilepost(milepost.id);
                            }}
                          >
                            <CollapseHeader style={styles.postHeadline}>
                              <View>
                                <Text style={styles.picButtonTextLarge}>
                                  {milepost.name}
                                </Text>
                              </View>
                            </CollapseHeader>
                            <CollapseBody style={styles.postBody}>
                              {milepost.type == "pictures&reading" ? (
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
                                  <TouchableOpacity style={styles.picButton}>
                                    <Text style={styles.picButtonText}>
                                      Take Photo
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View>
                                  {(thing.type == "Caravan"
                                    ? caravanAspects
                                    : boatAspects
                                  ).map((aspect, index) => {
                                    return (
                                      <View style={styles.actions}>
                                        {milepost.pictures &&
                                        milepost.pictures[index + 1] &&
                                        milepost.pictures[index + 1][
                                          "aspect"
                                        ] ? (
                                          <MaterialCommunityIcons
                                            style={styles.icon}
                                            name="check-outline"
                                            size={34}
                                            color="green"
                                          />
                                        ) : null}

                                        <TouchableOpacity
                                          style={styles.picButton}
                                          onPress={() => {
                                            setCurrentPicDest({
                                              milepost_id: milepost.id,
                                              picNumber: index + 1,
                                              aspect: aspect,
                                            });

                                            __startCamera();
                                          }}
                                        >
                                          <Text style={styles.picButtonText}>
                                            Take Photo of {aspect}
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    );
                                  })}
                                </View>
                              )}
                            </CollapseBody>
                          </Collapse>
                        </View>
                      );
                  })}
                </View>
              );
            })}

            <View style={styles.actions}>
              {thingsToCarry.map((thing) => {
                return (
                  <TouchableOpacity
                    style={styles.picButton}
                    onPress={async () => {
                      setProgress(true);
                      await fetch(
                        "https://asia-southeast2-tawtripmanager.cloudfunctions.net/createTripReport?pin=" +
                          pin +
                          "&&business=1&&tripName=" +
                          trip.name +
                          "&&name=" +
                          state.loggedInName +
                          "&&email=" +
                          state.loggedInEmail +
                          "&&chasis=" +
                          thing.chasis
                      );
                      setProgress(false);
                      ToastAndroid.show(
                        "Report sent to email " + state.loggedInEmail,
                        ToastAndroid.LONG
                      );
                    }}
                  >
                    <Text styles={style.picButtonText}>
                      Email Report Chassis +{thing.chasis}{" "}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => {
                  navigation.navigate("Entry");
                }}
              >
                <Text style={styles.picButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",

    justifyContent: "flex-start",
  },
  introCard: {
    marginTop: "10%",
    alignSelf: "center",
    marginBottom: "10%",
    flexDirection: "column",
    borderWidth: 3,
    borderColor: "#e4581e",
    backgroundColor: "#d7d4d2",
    width: "95%",
    shadowColor: "#ff0000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  reportButtons: {
    flex: 1,
    marginTop: 20,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  single: {
    width: 150,
    height: 60,
  },
  punch: {
    fontSize: 20,
    marginBottom: 40,

    color: "#ff1616",
    paddingLeft: 10,
  },

  hiMsg: {
    fontSize: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    zIndex: 999,

    color: "#ff1616",
  },
  progress: {
    margin: 100,
  },
  postHeadline: {
    color: "#e4581e",
    marginBottom: 15,
    padding: 10,
    fontSize: 15,
  },
  postBody: {
    backgroundColor: "transparent",
    color: "#ff1616",
    marginTop: 15,
    padding: 10,
  },
  icon: {
    alignSelf: "center",
    marginLeft: 50,
  },
  postCard: {
    marginTop: "15%",
    marginVertical: "3%",
    flexDirection: "column",
    borderWidth: 0,
    borderColor: "#061933",
    width: "98%",
    shadowColor: "#061933",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  picButton: {
    color: "#e4581e",
    width: "65%",
    paddingLeft: 2,
    marginBottom: 5,
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 15,
  },
  picButtonText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    color: "#e4581e",
  },
  picButtonTextLarge: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 10,
    color: "#516273",
    paddingLeft: 10,
  },

  signOutButton: {
    fontSize: 44,
    alignSelf: "flex-end",
    width: "50%",

    marginBottom: 5,
    borderColor: "mediumturquoise",
    backgroundColor: "#ff1616",
    padding: 13,
    marginRight: 10,
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 30,
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 60,
    borderWidth: 2,
  },
});

const TASK_NAME = "BACKGROUND_TASK";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // fetch data here...
    await __sendLocation();
    console.log("My task ");
    return BackgroundFetch.Result.NewData;
  } catch (err) {
    console.log(err);
    return BackgroundFetch.Result.Failed;
  }
});

RegisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 80, // seconds,
    });
    console.log("Task registered");
  } catch (err) {
    console.log("Task Register failed:", err);
  }
};

// const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

// // 1 define the task passing its name and a callback that will be called whenever the location changes
// TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   const [location] = locations;
//   try {

//     __sendLocation(location);
//   } catch (err) {
//     console.error(err);
//   }
// });

// // 2 start the task
