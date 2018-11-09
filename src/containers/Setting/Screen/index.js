import React, { PureComponent } from "react";
import { View, Text, AsyncStorage } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

type Props = {
  navigation: Object,
};

class Setting extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  signOut = async () => {
    await AsyncStorage.multiRemove(["user", "userId"]);
    const resetAction = NavigationActions.navigate({
      routeName: "Auth",
      action: NavigationActions.navigate({ routeName: "Login0" }),
    });
    this.props.navigation.dispatch(resetAction);
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Text>Setting</Text>
        <Text
          style={{
            margin: 5,
            padding: 7,
          }}
          onPress={this.signOut}
        >
          Logout
        </Text>
        {/* <Text
          onPress={() => this.props.navigation.navigate("Profile")}
          style={{ marginVertical: 20, paddingVertical: 20 }}
        >
          Trang cá nhân
        </Text> */}
      </View>
    );
  }
}

export default connect()(Setting);
