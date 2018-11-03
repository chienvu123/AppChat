import thunk from "redux-thunk";
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from "react-navigation-redux-helpers";

const middleware = [
  thunk,
  createReactNavigationReduxMiddleware("root", (state) => state.navigation),
];

const addListener = createReduxBoundAddListener("root");

export { middleware, addListener };
