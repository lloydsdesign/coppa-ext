import React, { Component } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { ext } from "../extension";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

class UserBlocked extends Component {
  render() {
    console.log("Rendering UserBlocked");
    const { minAge, blockedTitle, blockedMessage, renderButton } = this.props;

    return (
      <LinearGradient colors={["#FF2EA6", "#4CC2F1"]} style={styles.container}>
        <Text style={styles.title}>{blockedTitle || "We're sorry..."}</Text>
        <Text style={styles.subtitle}>{blockedMessage || "You are under"}</Text>
        {renderButton()}
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
    alignItems: "center"
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
    height: 64,
    borderRadius: 32,
    marginTop: 22,
    backgroundColor: "#147791",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2
  },
  confirmButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18
  }
});
