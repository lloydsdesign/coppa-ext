// This file is managed by Shoutem CLI
// You should not change it
import pack from "./package.json";

// screens imports
import AgeVerification from "./screens/AgeVerification";
import UserBlocked from "./screens/UserBlocked";

// themes imports

export const screens = {
  AgeVerification,
  UserBlocked
};

export const themes = {};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
