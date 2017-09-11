import React, { Component } from "react";

import { Alert, AsyncStorage, StyleSheet, Text, View } from "react-native";

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
import { ext } from "../extension";
import { connect } from "react-redux";

class AgeVerification extends Component {
  constructor(props) {
    super(props);

    const date18Yago = new Date();
    date18Yago.setFullYear(date18Yago.getFullYear() - 18);

    this.state = {
      enteredDate: date18Yago
    };
  }

  onDateChange = inputDate => {
    checkAge(inputDate, this.props.minAge)
      .then(getPrefferedAction)
      .then(prefferedAction => {
        if (prefferedAction == SKIP_VERIFICATION) {
          return this.props.onVerificationSuccess();
        } else {
          return this.props.onVerificationFailure();
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter your date of birth!</Text>

        <View style={{ flexDirection: "row" }}>
          <DatePicker
            style={{ flex: 1 }}
            date={this.state.enteredDate}
            mode="date"
            androidMode="spinner"
            placeholder="Enter your birth date"
            format={this.props.dateFormat}
            minDate={new Date(1920, 0, 1)}
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={this.onDateChange}
          />
        </View>
      </View>
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
export default connect(mapStateToProps, { replace, navigateTo })(
  AgeVerification
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 20
  }
});
