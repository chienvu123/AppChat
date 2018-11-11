import React from "react";
import { BackHandler } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import RootNavigator from "./rootNavigator";
import { addListener } from "../utilities/redux";

type Props = {
  navigation: Object,
  dispatch: Function,
};

class AppWithNavigationState extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackButtonPressAndroid,
    );
  }
  onBackButtonPressAndroid = () => {
    const { dispatch, navigation } = this.props;
    const routeTab = navigation.routes[1];
    if (navigation.index === 1) {
      if (routeTab.index === 0) {
        const routeHome = routeTab.routes[0];
        if (routeHome.index === 0) {
          const { scrollToTop } = routeHome.routes[0].params;
          console.log(scrollToTop);
          return scrollToTop();
        }
      } else if (routeTab.index === 3) {
        const routeMedical = routeTab.routes[3];
        const { routes } = routeMedical;
        if (routes[routes.length - 1].routeName === "AddPet") {
          const routeAddPet = routes[routes.length - 1];
          const { backHandler } = routeAddPet.params;
          backHandler();
        }
      }
    } else {
      const routeAuth = navigation.routes[0];
      if (routeAuth.index === 1) return false;
    }

    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    const { dispatch, navigation } = this.props;
    return (
      <RootNavigator
        navigation={{
          dispatch,
          state: navigation,
          addListener,
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  navigation: state.navigation,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppWithNavigationState);
