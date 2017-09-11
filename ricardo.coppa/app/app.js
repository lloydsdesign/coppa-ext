import {
  isEmptyRoute,
  isNavigationAction,
  navigateTo,
  redirectTo,
  rewrite,
  REPLACE
} from "@shoutem/core/navigation";
import { priorities, setPriority, before } from "@shoutem/core/middlewareUtils";
import { getExtensionSettings } from "shoutem.application";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import { ext } from "./extension";

const appScreens = {};

function appWillMount(app) {
  let screens = {};

  _.each(app.getScreens(), (screen, screenName) => {
    appScreens[screenName] = screen;
  });
}

export { appWillMount, appScreens };
