// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from "./extension.js";
import { createLoginMiddleware } from "./middleware";
import { appWillMount, appScreens } from "./app";

export const screens = extension.screens;
export const themes = extension.themes;
console.log("App screens:\n", appScreens);
export const middleware = [createLoginMiddleware(appScreens)];

export { appWillMount };
