import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";

type Props = {
  navigation: Object,
};

class Setting extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Text>EditText Screen</Text>
      </View>
    );
  }
}

export default connect()(Setting);
