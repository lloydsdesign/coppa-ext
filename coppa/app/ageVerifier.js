import { AsyncStorage } from "react-native";

export const SHOW_VERIFICATION = "show_verification";
export const SKIP_VERIFICATION = "skip_verification";
export const EXIT_APP = "exit_app";
export const STORAGE_KEY = "@coppa-age-restricted-status";
/**
 * Checks if user age is verified, blocked or unspecified
 * and returns the preffered action (show_verification, skip_verification, exit_app)
 */
export function getPrefferedAction() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(result => {
        const resultJSON = JSON.parse(result);
        if (resultJSON == null) {
          return resolve(SHOW_VERIFICATION);
        }

        if (resultJSON.status == "allowed") {
          return resolve(SKIP_VERIFICATION);
        }

        if (resultJSON.status == "blocked") {
          const oneDayInMs = 86400000;

          if (Date.now() - resultJSON.timestamp > oneDayInMs) {
            return resolve(SHOW_VERIFICATION);
          }
          return resolve(EXIT_APP);
        }

        return resolve(SHOW_VERIFICATION);
      })
      .catch(error => {
        console.log("Catch error in promise");
        return reject("Error in getPrefferedAction\n", error);
      });
  });
}

export function checkAge(inputDate, minAge) {
  const dateOfBirth = new Date(inputDate);
  const currentDate = new Date();

  const birthdayThisYear = new Date(currentDate);
  birthdayThisYear.setFullYear(currentDate.getFullYear());

  const hadBDayThisYear = currentDate > birthdayThisYear;

  let age = currentDate.getFullYear() - dateOfBirth.getFullYear();
  if (!hadBDayThisYear) {
    age -= 1;
  }

  const ageRestrictedStatus = {
    status: age >= minAge ? "allowed" : "blocked",
    timestamp: Date.now()
  };

  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ageRestrictedStatus));
}
