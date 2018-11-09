import { createSwitchNavigator } from "react-navigation";
import Auth from "../containers/Auth";
import Home from "./tabHome";

export default createSwitchNavigator(
  {
    Auth: {
      screen: Auth,
    },
    Home: {
      screen: Home,
    },
  },
  {
    // TODO change Home to Auth when has asyncStorage
    initialRouteName: "Auth",
    mode: "card",
    headerMode: "none",
  },
);
