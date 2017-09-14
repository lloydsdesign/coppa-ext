import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

import { Image } from "@shoutem/ui";
import { ext } from "../extension";

const TIMEOUT = 5000;

class UserBlocked extends Component {
  componentDidMount() {
    const { onSplashScreenDone } = this.props;

    if (onSplashScreenDone) {
      setTimeout(onSplashScreenDone, TIMEOUT);
    }
  }

  render() {
    const {
      minAge,
      blockedTitle,
      blockedMessage,
      renderButton,
      marginTopOverride
    } = this.props;

    // Ugly hack to cover navbar
    const coverNavBar = marginTopOverride
      ? { marginTop: marginTopOverride }
      : {};

    return (
      <LinearGradient
        colors={["#FF2EA6", "#4CC2F1"]}
        style={[styles.container, coverNavBar]}
      >
        <Text style={styles.title}>{blockedTitle || "We're sorry..."}</Text>
        <Text style={styles.subtitle}>
          {blockedMessage ||
            "You are under the minimum age required to use this app"}
        </Text>
        <View style={styles.confirmButton}>
          <Image
            source={require("../assets/cross.png")}
            style={{ width: 32, height: 32 }}
          />
        </View>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  const extName = ext();
  const { minAge, blockedTitle, blockedMessage } = state[
    "shoutem.application"
  ].extensions[extName].attributes.settings;

  return {
    blockedTitle,
    blockedMessage,
    minAge: parseInt(minAge, 10)
  };
};

export default connect(mapStateToProps)(UserBlocked);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    alignItems: "center",
    width: "100%"
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 128,
    color: "#ffffff"
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    color: "#ffffff"
  },
  confirmButton: {
    position: "absolute",
    top: "60%",
    height: 64,
    width: 64,
    borderRadius: 32,
    marginTop: 22,
    backgroundColor: "#FF2EA6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5
  }
});
