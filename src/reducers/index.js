import { combineReducers } from "redux";
import { createNavigationReducer } from "react-navigation-redux-helpers";
import RootNavigator from "../navigators/rootNavigator";
import user from "./user";
import tabbar from "./tabbar";
import rooms from "./rooms";

const navReducer = createNavigationReducer(RootNavigator);

const rootRecuder = combineReducers({
  navigation: navReducer,
  user,
  tabbar,
  rooms,
});

export default rootRecuder;
