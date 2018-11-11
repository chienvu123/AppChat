import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { Header } from "components/CustomComponent";

type Props = {
  navigation: Object,
};

class Template extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Header
          onLeftPress={() => this.props.navigation.goBack()}
          center="Mẫu in"
        />
      </View>
    );
  }
}

export default connect()(Template);
