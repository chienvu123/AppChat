import { createStackNavigator } from "react-navigation";
import Home from "./Screen";
import SynchData from "./SynchData";
import Template from "../Template";
import ShowTemplate from "../Template/ShowTemplate";
import SelectRoom from "./SelectRoom";
import Doc from "./Document";
import AddRoom from "./AddRoom";
import AddDocument from "./AddDocument";
import ListChange from "./ListChange";

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
    Document: {
      screen: Doc,
    },
    AddRoom: {
      screen: AddRoom,
    },
    AddDocument: {
      screen: AddDocument,
    },
    ListChange: {
      screen: ListChange,
    },
  },
  {
    initialRouteName: "SelectRoom",
    headerMode: "none",
    mode: "card",
  },
);
