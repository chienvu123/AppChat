import React, { PureComponent } from "react";
import { Text, TouchableOpacity, TextInput, View } from "react-native";
import { colors } from "themes";

type Props = {
  text: string,
  bgColor: string,
  // onLongPress: Function,
  enableEditing: boolean,
  onSubmit: Function,
};

class Item extends PureComponent<Props> {
  static defaultProps = {
    onPress: () => {},
    enableEditing: false,
    onSubmit: () => {},
  };
  constructor(props) {
    super(props);
    const { text } = this.props;
    this.state = {
      isEdit: false,
      text,
    };
  }
  submitEditing = () => {
    this.setState(
      {
        isEdit: false,
      },
      () => {
        this.props.onSubmit();
      },
    );
  };
  render() {
    const { bgColor, enableEditing } = this.props;
    const { isEdit, text } = this.state;
    const checkEditText = this.props.text === text;
    return (
      <TouchableOpacity
        onLongPress={() => {
          this.setState({ isEdit: true });
        }}
        style={{
          height: 36,
          justifyContent: "center",
          backgroundColor: checkEditText ? bgColor : colors.warning,
          marginBottom: 3,
          paddingLeft: 10,
        }}
        activeOpacity={0.9}
      >
        {isEdit && enableEditing ? (
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <TextInput
              style={{ width: "100%", height: "100%" }}
              value={text}
              onSubmitEditing={this.submitEditing}
              autoFocus
              onChangeText={(editText) => {
                this.setState({ text: editText });
              }}
              onBlur={() => {
                this.setState({ text: this.props.text, isEdit: false });
              }}
            />
            <TouchableOpacity onPress={this.submitEditing}>
              <Text>Xong</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ fontWeight: "bold", color: colors.white }}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

export default Item;
