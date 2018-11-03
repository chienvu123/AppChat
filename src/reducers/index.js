import { combineReducers } from "redux";
import { createNavigationReducer } from "react-navigation-redux-helpers";
import RootNavigator from "../navigators/rootNavigator";
import user from "./user";
import tabbar from "./tabbar";

const navReducer = createNavigationReducer(RootNavigator);

const rootRecuder = combineReducers({
  navigation: navReducer,
  user,
  tabbar,
});

export default rootRecuder;
