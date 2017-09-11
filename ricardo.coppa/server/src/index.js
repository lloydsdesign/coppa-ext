// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import AgeVerificationPage from './pages/age-verification-page';
import reducer from './redux';

export const pages = {
  AgeVerificationPage
};

//export { reducer };

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer(page);
}

export { pageReducer as reducer };
