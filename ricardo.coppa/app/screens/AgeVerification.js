import React, { Component } from "react";

import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import DatePicker from "react-native-datepicker";

import {
  getPrefferedAction,
  SHOW_VERIFICATION,
  SKIP_VERIFICATION,
  EXIT_APP,
  checkAge
} from "../ageVerifier";

import {
  replace,
  navigateTo,
  isNavigationAction
} from "@shoutem/core/navigation";

import { Icon } from "@shoutem/ui";

import { ext } from "../extension";
import { connect } from "react-redux";
import UserBlocked from "./UserBlocked";
import UserVerified from "./UserVerified";

export const BUTTON_CONTENT_CONFIRM = 0;
export const BUTTON_CONTENT_CHECK = 1;
export const BUTTON_CONTENT_CROSS = 2;
export const BUTTON_CONTENT_DOTS = 3;

export const SCREEN_VERIFY = 0;
export const SCREEN_SUCCESS = 1;
export const SCREEN_BLOCKED = 2;

class AgeVerification extends Component {
  constructor(props) {
    super(props);

    const date18Yago = new Date();
    date18Yago.setFullYear(date18Yago.getFullYear() - 18);

    this.state = {
      enteredDate: date18Yago,
      buttonContent: this.props.buttonContent || BUTTON_CONTENT_CONFIRM,
      buttonWidth: this.props.buttonWidth || new Animated.Value(240),
      fadableContentOpacity: new Animated.Value(1),
      activeScreen: this.props.activeScreen || SCREEN_VERIFY
    };
  }

  onDateChange = inputDate => {
    this.setState({ enteredDate: inputDate });
  };

  verifyAge = (onVerified, onBlocked) => {
    checkAge(this.state.enteredDate, this.props.minAge)
      .then(getPrefferedAction)
      .then(prefferedAction => {
        if (prefferedAction == SKIP_VERIFICATION) {
          onVerified();
          if (this.props.onVerificationSuccess)
            setTimeout(this.props.onVerificationSuccess, 5000);
        } else {
          onBlocked();
          if (this.props.onVerificationFailure)
            setTimeout(this.props.onVerificationFailure, 5000);
        }
      });
  };

  onButtonPress = () => {
    Animated.parallel([
      Animated.timing(this.state.buttonWidth, {
        toValue: 64,
        duration: 300
      }),
      Animated.timing(this.state.fadableContentOpacity, {
        toValue: 0,
        duration: 300
      })
    ]).start(() => {
      this.verifyAge(
        () => {
          this.setState({
            activeScreen: SCREEN_SUCCESS,
            buttonContent: BUTTON_CONTENT_CHECK
          });
        },
        () => {
          this.setState({
            activeScreen: SCREEN_BLOCKED,
            buttonContent: BUTTON_CONTENT_CROSS
          });
        }
      );
    });

    this.setState({
      buttonContent: BUTTON_CONTENT_DOTS
    });
  };

  getButtonContent = () => {
    switch (this.state.buttonContent) {
      case BUTTON_CONTENT_CONFIRM:
        return <Text style={styles.confirmButtonText}>C O N F I R M</Text>;
        break;
      case BUTTON_CONTENT_CHECK:
        return <Text style={{ fontSize: 48, color: "#ffffff" }}>✓</Text>;
        break;
      case BUTTON_CONTENT_CROSS:
        return <Icon style={{ color: "#ffffff", fontSize: 48 }} name="close" />;
        break;
      case BUTTON_CONTENT_DOTS:
        return <Text style={{ fontSize: 48, color: "#ffffff" }}>...</Text>;
      default:
        break;
    }
  };

  renderBlockScreen = renderButton => {
    return <UserBlocked renderButton={renderButton} />;
  };

  renderSuccessScreen = renderButton => {
    return <UserVerified renderButton={renderButton} />;
  };

  renderVerificationScreen = renderButton => {
    return (
      <LinearGradient colors={["#4CC2F1", "#66CCCC"]} style={styles.container}>
        <Animated.View
          style={[
            styles.fadableContent,
            { opacity: this.state.fadableContentOpacity }
          ]}
        >
          <Text style={styles.title}>Verify Your Age</Text>
          <Text style={styles.subtitle}>
            In order to start using the app, you need to be {this.props.minAge}{" "}
            or older
          </Text>
          <DatePicker
            style={styles.datepicker}
            date={this.state.enteredDate}
            mode="date"
            androidMode="spinner"
            placeholder="Enter your birth date"
            format={this.props.dateFormat}
            minDate={new Date(1920, 0, 1)}
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: styles.datepickerInput,
              dateText: styles.datepickerText
            }}
            onDateChange={this.onDateChange}
          />
          <Text style={styles.datepickerSubtitle}>
            Please select your birth date
          </Text>
        </Animated.View>

        {renderButton()}
      </LinearGradient>
    );
  };

  renderButton = () => {
    const buttonContent = this.getButtonContent();
    return (
      <Animated.View
        style={[styles.confirmButtonWrapper, { width: this.state.buttonWidth }]}
      >
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={this.onButtonPress}
          disabled={this.state.buttonContent != BUTTON_CONTENT_CONFIRM}
        >
          {buttonContent}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  render() {
    const { activeScreen } = this.state;

    let screen;
    switch (activeScreen) {
      case SCREEN_VERIFY:
        screen = this.renderVerificationScreen(this.renderButton);
        break;
      case SCREEN_BLOCKED:
        screen = this.renderBlockScreen(this.renderButton);
        break;
      case SCREEN_SUCCESS:
        screen = this.renderSuccessScreen(this.renderButton);
        break;
      default:
        break;
    }
    return <View style={{ flex: 1, marginTop: -57, zIndex: 1 }}>{screen}</View>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const extName = ext();
  const { dateFormat, minAge } = state["shoutem.application"].extensions[
    extName
  ].attributes.settings;

  return { dateFormat, minAge: parseInt(minAge, 10) };
};

// connect screen to redux store
export default connect(mapStateToProps, { replace, navigateTo })(
  AgeVerification
);

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    flex: 1,
    alignItems: "center"
  },
  fadableContent: {
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
  datepicker: {
    height: 48,
    width: 240,
    marginTop: 64
  },
  datepickerInput: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: "white"
  },
  datepickerText: {
    color: "#bbbbbb",
    fontSize: 18
  },
  datepickerSubtitle: {
    marginTop: 0,
    fontSize: 14,
    color: "#ffffff"
  },
  confirmButtonWrapper: {
    position: "absolute",
    top: "70%"
  },
  confirmButton: {
    height: 64,
    marginTop: 22,
    borderRadius: 32,
    backgroundColor: "#147791",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
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
