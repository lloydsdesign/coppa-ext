import { Alert, AsyncStorage } from "react-native";

import { isRSAA, RSAA } from "redux-api-middleware";

import * as _ from "lodash";
import URI from "urijs";

import { UPDATE_SUCCESS } from "@shoutem/redux-io";

import {
  isEmptyRoute,
  isNavigationAction,
  navigateTo,
  redirectTo,
  rewrite,
  REPLACE,
  RESET_TO_ROUTE,
  reset
} from "@shoutem/core/navigation";

import { priorities, setPriority, before } from "@shoutem/core/middlewareUtils";

import { RESTART_APP } from "@shoutem/core/coreRedux";
import { getExtensionSettings } from "shoutem.application";

import { ext } from "./extension";
import {
  getPrefferedAction,
  SHOW_VERIFICATION,
  SKIP_VERIFICATION,
  EXIT_APP,
  STORAGE_KEY
} from "./ageVerifier";

const hasValidRoute = action => action.route && !isEmptyRoute(action.route);

export const createLoginMiddleware = screens => {
  return setPriority(
    store => next => action => {
      // We want to intercept only actions with a route because this is the only way
      // to open a new screen.
      const shouldIntercept =
        isNavigationAction(action) &&
        hasValidRoute(action) &&
        (action.route != ext("AgeVerification") &&
          action.route != ext("UserBlocked")); // This makes sure that we don't intercept the AgeVerification screen

      if (!shouldIntercept) {
        return next(action);
      }

      // Uncomment this to test the functionality...
      // First uncomment and start the app, then comment it out and restart...
      //AsyncStorage.removeItem(STORAGE_KEY);

      // Helper function to replace the current screen with UserBlocked screen
      const gotoUserBlockedScreen = () => {
        return next(
          redirectTo(rewrite(action, RESET_TO_ROUTE), {
            screen: ext("UserBlocked"),
            title: "User Blocked"
          })
        );
      };

      // Helper function to replace the current screen with UserBlocked screen
      const gotoVerificationScreen = ({ onSuccess, onFailure }) => {
        return next(
          redirectTo(rewrite(action, RESET_TO_ROUTE), {
            screen: ext("AgeVerification"),
            props: {
              onVerificationSuccess: onSuccess,
              onVerificationFailure: onFailure
            }
          })
        );
      };

      return getPrefferedAction().then(verificationAction => {
        switch (verificationAction) {
          case SKIP_VERIFICATION:
            return next(action);
            break;
          case SHOW_VERIFICATION:
            return gotoVerificationScreen({
              onSuccess: () => store.dispatch(rewrite(action, REPLACE)),
              onFailure: () =>
                store.dispatch(
                  reset({
                    screen: ext("UserBlocked"),
                    title: "User Blocked"
                  })
                )
            });
            break;
          case EXIT_APP:
          default:
            return gotoUserBlockedScreen();
            break;
        }
      });
    },
    priorities.AUTH
  );
};
