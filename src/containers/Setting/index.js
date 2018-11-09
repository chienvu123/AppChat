import { createStackNavigator } from "react-navigation";
import SettingScreen from "./Screen";

export default createStackNavigator(
  {
    SettingScreen: {
      screen: SettingScreen,
    },
  },
  {
    initialRouteName: "SettingScreen",
    headerMode: "modal",
  },
);
