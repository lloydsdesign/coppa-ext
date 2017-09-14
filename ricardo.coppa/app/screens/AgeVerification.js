import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { connect } from "react-redux";

import LinearGradient from "react-native-linear-gradient";
import DatePicker from "react-native-datepicker";

import { ext } from "../extension";
import {
  getPrefferedAction,
  SHOW_VERIFICATION,
  SKIP_VERIFICATION,
  checkAge
} from "../ageVerifier";
import UserVerified from "./UserVerified";
import UserBlocked from "./UserBlocked";

export const BUTTON_TEXT_CONFIRM = "C O N F I R M";
export const BUTTON_TEXT_EMPTY = "";

class AgeVerification extends Component {
  constructor(props) {
    super(props);

    const date18Yago = new Date();
    date18Yago.setFullYear(date18Yago.getFullYear() - 18);

    this.state = {
      enteredDate: date18Yago,
      buttonText: BUTTON_TEXT_CONFIRM,
      buttonWidth: new Animated.Value(240)
    };
  }

  _onDateChange = (inputDateString, inputDate) => {
    this.setState({ enteredDate: inputDate });
  };

  _verifyAge = ({ onVerified, onBlocked }) => {
    const { minAge } = this.props;
    const { enteredDate } = this.state;

    checkAge(enteredDate, minAge)
      .then(getPrefferedAction)
      .then(prefferedAction => {
        if (prefferedAction == SKIP_VERIFICATION) {
          onVerified();
        } else {
          onBlocked();
        }
      });
  };

  _onButtonPress = () => {
    const { onVerified, onBlocked } = this.props;

    Animated.timing(this.state.buttonWidth, {
      toValue: 64,
      duration: 300
    }).start(() => {
      this._verifyAge({
        onVerified,
        onBlocked
      });
    });

    this.setState({
      buttonText: BUTTON_TEXT_EMPTY
    });
  };

  render() {
    const { buttonText } = this.state;

    return (
      <LinearGradient colors={["#4CC2F1", "#66CCCC"]} style={styles.container}>
        <Animated.View style={styles.fadableContent}>
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
            onDateChange={this._onDateChange}
          />
          <Text style={styles.datepickerSubtitle}>
            Please select your birth date
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.confirmButtonWrapper,
            { width: this.state.buttonWidth }
          ]}
        >
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={this._onButtonPress}
            disabled={buttonText != BUTTON_TEXT_CONFIRM}
          >
            <Text style={styles.confirmButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
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
export default connect(mapStateToProps)(AgeVerification);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
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
    top: "60%"
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
