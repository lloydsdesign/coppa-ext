// This file is managed by Shoutem CLI
// You should not change it
import pack from "./package.json";

// screens imports
import AgeVerificationComposer from "./screens/AgeVerificationComposer";
import UserBlocked from "./screens/UserBlocked";

// themes imports

export const screens = {
  AgeVerificationComposer,
  UserBlocked
};

export const themes = {};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
