import * as React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function TripEditor({ navigation, route }) {
  const pin = route.params?.pin;

  return (
    <WebView
      scalesPageToFit={false}
      cacheEnabled={false}
      style={{ ...styles.container, resizeMode: "cover" }}
      source={{
        uri: "https://proud-outpost-329301.firebaseapp.com?pin=" + pin,
      }}
    />
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

    justifyContent: "center",
  },
});
