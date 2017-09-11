import React, { Component } from "react";
import { View } from "react-native";
import { Caption, Title, Heading, Text } from "@shoutem/ui";
import { ext } from "../extension";
import { connect } from "react-redux";

class UserBlocked extends Component {
  render() {
    const { minAge, blockedTitle, blockedMessage } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Title>{blockedTitle || "User Blocked"}</Title>
        <Text>
          {blockedMessage ||
            `You have to be at least ${minAge} old to use this app.`}
        </Text>
      </View>
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
