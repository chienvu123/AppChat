import React, { PureComponent } from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { horizontalScale } from "utilities/Tranform";

const style = StyleSheet.create({
  text: {
    padding: 0,
    fontSize: horizontalScale(15),
  },
});

export default class TextCustom extends PureComponent<TextProps> {
  state = {};
  render() {
    return (
      <Text {...this.props} style={[style.text, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}
