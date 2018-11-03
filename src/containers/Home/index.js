import { createStackNavigator } from "react-navigation";
import Home from "./Screen";

export default createStackNavigator(
  {
    Home: {
      screen: Home,
    },
  },
  {
    headerMode: "none",
    mode: "card",
  },
);
