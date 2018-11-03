import React, { PureComponent } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors } from "themes";
import { horizontalScale, verticalScale } from "utilities/Tranform";

const input = StyleSheet.create({
  container: {
    width: horizontalScale(260),
    height: verticalScale(46),
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: verticalScale(23),
    color: colors.white,
    paddingLeft: horizontalScale(31),
  },
});

export default class Index extends PureComponent<TextInputProps> {
  static defaultProps = {
    underlineColorAndroid: "transparent",
    placeholderTextColor: colors.placeholderColorWhite,
    onSubmitEditing: () => {},
  };
  state = {};
  focus = () => {
    this.input.focus();
  };
  render() {
    return (
      <TextInput
        {...this.props}
        ref={(node) => {
          this.input = node;
        }}
        placeholderTextColor={this.props.placeholderTextColor}
        style={[input.container, this.props.style]}
        underlineColorAndroid={this.props.underlineColorAndroid}
      />
    );
  }
}
