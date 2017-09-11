import React, { Component, PropTypes } from "react";
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from "react-bootstrap";
import { LoaderContainer } from "@shoutem/react-web-ui";
import {
  fetchExtension,
  updateExtensionSettings,
  getExtension
} from "@shoutem/redux-api-sdk";
import { shouldRefresh } from "@shoutem/redux-io";
import { connect } from "react-redux";
import "./style.scss";

class AgeVerificationPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func
  };

  constructor(props) {
    super(props);

    props.fetchExtension();

    console.log("CTOR before setting state:\n", this.state);

    this.state = {
      error: null,
      minAge: _.get(props.extension, "settings.minAge"),
      dateFormat: _.get(props.extension, "settings.dateFormat"),
      blockedTitle: _.get(props.extension, "settings.blockedTitle"),
      blockedMessage: _.get(props.extension, "settings.blockedMessage"),
      // flag indicating if value in input field is changed
      hasChanges: false,
      inProgress: false
    };

    console.log("CTOR:\n", this.state);
  }

  componentWillReceiveProps(nextProps) {
    const { extension } = this.props;
    const { extension: nextExtension } = nextProps;

    console.log("ComponentWillRecieveProps\nState:\n", this.state);
    console.log("\nnextProps:\n", nextProps);

    const settings = ["minAge", "dateFormat", "blockedTitle", "blockedMessage"];

    settings.forEach(setting => {
      console.log("forEach setting:\n", setting);

      const settingInState = this.state[setting];
      console.log("settingInState:\n", settingInState);

      if (_.isEmpty(settingInState)) {
        console.log("_isEmpty is true ", setting);
        // TODO : CHECK THIS OUT!!!
        this.setState({
          [setting]: _.get(nextExtension, "settings." + setting)
        });
      }
    });

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      console.log("entered if (extension !== next...)");
      this.props.fetchExtension();
    }
  }

  handleMinAgeChange = event => {
    this.setState({
      minAge: event.target.value,
      hasChanges: true
    });
  };

  handleDateFormatChange = event => {
    this.setState({
      dateFormat: event.target.value,
      hasChanges: true
    });
  };

  handleBlockedTitleChange = event => {
    this.setState({
      blockedTitle: event.target.value,
      hasChanges: true
    });
  };

  handleBlockedMessageChange = event => {
    this.setState({
      blockedMessage: event.target.value,
      hasChanges: true
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.handleSave();
  };

  handleSave = () => {
    const { extension } = this.props;

    const { minAge, dateFormat, blockedTitle, blockedMessage } = this.state;

    const newSettings = {
      minAge,
      dateFormat,
      blockedTitle,
      blockedMessage
    };

    this.setState({ error: "", inProgress: true });
    this.props
      .updateExtensionSettings(extension, newSettings)
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  };

  render() {
    const {
      minAge,
      dateFormat,
      blockedTitle,
      blockedMessage,
      error,
      hasChanges,
      inProgress
    } = this.state;

    return (
      <div className="hello-extension-settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Configure Age Verification</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{ flex: 1, flexDirection: "column", paddingRight: 8 }}
              >
                <ControlLabel>Min Age:</ControlLabel>
                <FormControl
                  type="number"
                  min="13"
                  max="65"
                  className="form-control"
                  value={minAge}
                  onChange={this.handleMinAgeChange}
                  required
                />
              </div>
              <div style={{ flex: 1, flexDirection: "column", paddingLeft: 8 }}>
                <ControlLabel>Date Format:</ControlLabel>
                <FormControl
                  className="form-control"
                  componentClass="select"
                  placeholder={"Date Format..."}
                  onChange={this.handleDateFormatChange}
                  value={dateFormat}
                  required
                >
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="YYYY-DD-MM">YYYY-DD-MM</option>
                </FormControl>
              </div>
            </div>
            <ControlLabel>User Blocked Title:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={blockedTitle}
              onChange={this.handleBlockedTitleChange}
              maxLength="50"
              required
            />
            <ControlLabel>User Blocked Message:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={blockedMessage}
              onChange={this.handleBlockedMessageChange}
              maxLength="500"
              required
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>Save</LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AgeVerificationPage
);
