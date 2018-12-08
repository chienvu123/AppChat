import React from "react";
import { connect } from "react-redux";
import RootNavigator from "./rootNavigator";
import { addListener } from "../utilities/redux";

type Props = {
  navigation: Object,
  dispatch: Function,
};

class AppWithNavigationState extends React.PureComponent<Props> {
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
