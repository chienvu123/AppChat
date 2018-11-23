import { createStackNavigator } from "react-navigation";
import Home from "./Screen";
import SynchData from "./SynchData";
import Template from "../Template";
import ShowTemplate from "../Template/ShowTemplate";
import SelectRoom from "./SelectRoom";

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
    ShowTemplate: {
      screen: ShowTemplate,
    },
    SelectRoom: {
      screen: SelectRoom,
    },
  },
  {
    initialRouteName: "SelectRoom",
    headerMode: "none",
    mode: "card",
  },
);
