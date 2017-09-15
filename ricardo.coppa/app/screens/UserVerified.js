import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { Image } from "@shoutem/ui";

import { ext } from "../extension";

const TIMEOUT = 3500;

class UserVerified extends Component {
  componentDidMount() {
    const { onSplashScreenDone } = this.props;

    if (onSplashScreenDone) {
      this.timeout = setTimeout(onSplashScreenDone, TIMEOUT);
    }
  }

  _onButtonPress = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);

      const { onSplashScreenDone } = this.props;
      if (onSplashScreenDone) {
        onSplashScreenDone();
      }
    }
  };

  render() {
    const { verifiedTitle, verifiedMessage } = this.props;

    return (
      <LinearGradient colors={["#66CCCC", "#00DEC4"]} style={styles.container}>
        <Text style={styles.title}>{verifiedTitle || "Success!"}</Text>
        <Text style={styles.subtitle}>
          {verifiedMessage || "Enjoy your app experience!"}
        </Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={this._onButtonPress}
        >
          <Image
            source={require("../assets/check.png")}
            style={{ width: 48, height: 48 }}
          />
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  const extName = ext();
  const { verifiedTitle, verifiedMessage } = state[
    "shoutem.application"
  ].extensions[extName].attributes.settings;

  return {
    verifiedTitle,
    verifiedMessage
  };
};

export default connect(mapStateToProps)(UserVerified);

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
    backgroundColor: "#1EADA9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5
  }
});
