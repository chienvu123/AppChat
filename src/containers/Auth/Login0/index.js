/**
 * @flow
 */
import React, { PureComponent } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { images, colors } from "themes";
import style from "./style";

type Props = {
  navigation: Object,
};

export default class Login extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground source={images.background} style={{ flex: 1 }}>
        <View style={style.vTop}>
          <ImageBackground
            source={images.logo}
            style={style.logo}
            resizeMethod="resize"
            resizeMode="contain"
          />
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
            HMCA
          </Text>
        </View>
        <View style={style.vBottom}>
          <TouchableOpacity
            style={style.btn}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={[style.txt, { color: colors.default }]}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.btn, { backgroundColor: colors.secondary_dark }]}
            onPress={() => this.props.navigation.navigate("Signup")}
          >
            <Text style={style.txt}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
