import React, { Component } from "react";
import { StyleSheet, View, Animated } from "react-native";

import UserBlocked from "./UserBlocked";
import UserVerified from "./UserVerified";
import AgeVerification from "./AgeVerification";

const BACK_SCREEN_BLOCKED = 0;
const BACK_SCREEN_VERIFIED = 1;

export default class AgeVerificationComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontScreenOpacity: new Animated.Value(1),
      shouldShowFrontScreen: true
    };
  }

  _fadeOutFrontScreen = () => {
    Animated.timing(this.state.frontScreenOpacity, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.setState({ shouldShowFrontScreen: false });
    });
  };

  _onVerified = () => {
    this.setState({
      backScreen: BACK_SCREEN_VERIFIED
    });
    this._fadeOutFrontScreen();
  };

  _onBlocked = () => {
    this.setState({
      backScreen: BACK_SCREEN_BLOCKED
    });
    this._fadeOutFrontScreen();
  };

  _renderFrontScreen = () => {
    const { frontScreenOpacity, shouldShowFrontScreen } = this.state;

    if (shouldShowFrontScreen) {
      return (
        <Animated.View
          style={[
            styles.frontScreen,
            {
              opacity: frontScreenOpacity
            }
          ]}
        >
          <AgeVerification
            onVerified={this._onVerified}
            onBlocked={this._onBlocked}
          />
        </Animated.View>
      );
    }

    return null;
  };

  _renderBackScreen = () => {
    const { backScreen } = this.state;
    const { onVerifiedScreenDone, onBlockedScreenDone } = this.props;

    if (backScreen === BACK_SCREEN_VERIFIED) {
      return <UserVerified onSplashScreenDone={onVerifiedScreenDone} />;
    } else if (backScreen === BACK_SCREEN_BLOCKED) {
      return <UserBlocked onSplashScreenDone={onBlockedScreenDone} />;
    } else {
      return null;
    }
  };

  render() {
    const frontScreen = this._renderFrontScreen();
    const backScreen = this._renderBackScreen();

    return (
      <View style={styles.container}>
        <View style={styles.backScreen}>{backScreen}</View>
        {frontScreen}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginTop: -57,
    zIndex: 30,
    flex: 1,
    width: "100%",
    height: "100%"
  },
  frontScreen: {
    position: "absolute",
    marginTop: 0,
    zIndex: 2,
    height: "100%",
    width: "100%"
  },
  backScreen: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    width: "100%"
  }
});
