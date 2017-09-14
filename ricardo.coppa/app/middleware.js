import {
  isEmptyRoute,
  isNavigationAction,
  redirectTo,
  rewrite,
  REPLACE,
  RESET_TO_ROUTE
} from "@shoutem/core/navigation";
import { priorities, setPriority } from "@shoutem/core/middlewareUtils";

import { ext } from "./extension";
import {
  getPrefferedAction,
  SHOW_VERIFICATION,
  SKIP_VERIFICATION,
  EXIT_APP
} from "./ageVerifier";

const hasValidRoute = action => action.route && !isEmptyRoute(action.route);

export const createLoginMiddleware = screens => {
  // Uncomment this to test the functionality...
  // REMOVE THIS IN PRODUCTION! ! ! !
  // import { AsyncStorage } from "react-native";
  // AsyncStorage.removeItem("@coppa-age-restricted-status");

  return setPriority(
    store => next => action => {
      // We want to intercept only actions with a route because this is the only way
      // to open a new screen.
      const isExtensionScreen =
        action.route == ext("AgeVerificationComposer") ||
        action.route == ext("UserBlocked");

      const shouldIntercept =
        isNavigationAction(action) &&
        hasValidRoute(action) &&
        !isExtensionScreen; // This makes sure that we don't intercept our own screens

      if (!shouldIntercept) {
        return next(action);
      }

      // Helper function to replace the current screen with UserBlocked screen
      const gotoUserBlockedScreen = () => {
        return next(
          redirectTo(rewrite(action, RESET_TO_ROUTE), {
            screen: ext("UserBlocked"),
            title: "User Blocked",
            props: {
              marginTopOverride: -57 // Ugly hack to cover navbar
            }
          })
        );
      };

      // Helper function to replace the current screen with UserBlocked screen
      const gotoVerificationScreen = ({ onSuccess, onFailure }) => {
        return next(
          redirectTo(rewrite(action, RESET_TO_ROUTE), {
            screen: ext("AgeVerificationComposer"),
            props: {
              onVerifiedScreenDone: onSuccess,
              onBlockedScreenDone: onFailure
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
              onFailure: () => {}
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
