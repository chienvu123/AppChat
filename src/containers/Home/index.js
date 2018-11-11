import { createStackNavigator } from "react-navigation";
import Home from "./Screen";
import SynchData from "./SynchData";
import Template from "../Template";

export default createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    SynchData: {
      screen: SynchData,
    },
    Template: {
      screen: Template,
    },
  },
  {
    headerMode: "none",
    mode: "card",
  },
);
