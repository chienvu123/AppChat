import { createStackNavigator } from "react-navigation";
import Splash from "./Splash";
import Login from "./Login";
import Login0 from "./Login0";
import Signup from "./Signup";
import LinkApp from "./LinkApp";

export default createStackNavigator(
  {
    Splash: {
      screen: Splash,
    },
    Login0: {
      screen: Login0,
    },
    Signup: {
      screen: Signup,
    },
    Login: {
      screen: Login,
    },
    LinkApp: {
      screen: LinkApp,
    },
  },
  {
    initialRouteName: "Splash",
    headerMode: "none",
  },
);
