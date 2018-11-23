import React, { PureComponent } from "react";
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { images, icons, colors } from "themes";
import * as Custom from "components/CustomComponent";
import UserModel from "actions/user";
import style from "./style";
import {
  checkInputLogin,
  convertPhoneNumber11to10,
  checkErrorCode,
} from "../check";

type Props = {
  navigation: Object,
  setUser: Function,
};

class Index extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      message: "",
      isShowPassword: true,
      isLogin: false,
    };
  }

  phoneText: string;
  passwordText: string;
  checkRequest = () => {
    if (!this.state.isLogin) {
      this.login();
    }
  };
  login = async () => {
    await this.setState({
      message: "",
      isLogin: true,
    });
    const { result, message } = checkInputLogin(
      this.phoneText,
      this.passwordText,
    );
    if (result) {
      const phoneNumber = convertPhoneNumber11to10(this.phoneText);
      UserModel.logIn(
        {
          phoneNumber,
          password: this.passwordText,
        },
        (user, tokenId) => {
          this.props.setUser(user, tokenId);
          this.props.navigation.navigate("Home");
        },
        (error) => {
          console.log("error", error);
          const { code } = error;
          const messageCheck = checkErrorCode(code);
          this.setState({
            message: messageCheck,
            isLogin: false,
          });
        },
      );
    } else {
      console.log("error");
      this.setState({
        message,
        isLogin: false,
      });
    }
  };
  render() {
    return (
      <ImageBackground source={images.background} style={style.container}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}
          activeOpacity={1}
        >
          <View style={style.vTop}>
            <ImageBackground
              source={images.logo}
              style={style.logoLogin}
              resizeMethod="resize"
              resizeMode="contain"
            />
          </View>
          <View style={style.vMid}>
            <View style={style.form}>
              <View style={style.vInput}>
                <View style={style.vImage}>
                  <Image source={icons.profile} />
                </View>
                <TextInput
                  ref={(node) => {
                    this.phoneInput = node;
                  }}
                  style={style.input}
                  maxLength={16}
                  placeholder="Số điện thoại của bạn ..."
                  onChangeText={(text) => {
                    this.phoneText = text;
                  }}
                  placeholderTextColor={colors.placeholderColorWhite}
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.password.focus();
                  }}
                />
              </View>
              <View style={style.vInput}>
                <View style={style.vImage}>
                  <Image source={icons.password} />
                </View>
                <TextInput
                  ref={(node) => {
                    this.password = node;
                  }}
                  style={style.input}
                  placeholder="Mật khẩu ..."
                  onChangeText={(text) => {
                    this.passwordText = text;
                  }}
                  placeholderTextColor={colors.placeholderColorWhite}
                  underlineColorAndroid="transparent"
                  returnKeyType="done"
                  secureTextEntry={this.state.isShowPassword}
                  onSubmitEditing={this.login}
                />
                <TouchableOpacity
                  style={style.btnShow}
                  activeOpacity={0.9}
                  onPress={() =>
                    this.setState({
                      isShowPassword: !this.state.isShowPassword,
                    })
                  }
                >
                  <Image
                    source={icons.showPassword}
                    style={{ width: 15, height: 15 }}
                  />
                </TouchableOpacity>
              </View>
              {this.state.message ? (
                <Custom.Text style={{ color: "red" }}>
                  {this.state.message}
                </Custom.Text>
              ) : null}
            </View>
          </View>
          <View style={style.vBottom}>
            <View style={style.vBottom1}>
              <TouchableOpacity style={style.btn} onPress={this.login}>
                {this.state.isLogin ? (
                  <ActivityIndicator color={colors.default} size="small" />
                ) : (
                  <Custom.Text style={[style.txt, { color: colors.default }]}>
                    Đăng nhập
                  </Custom.Text>
                )}
              </TouchableOpacity>
              <Custom.Text
                style={style.txtBottom}
                onPress={() => {
                  console.log("quên mật khẩu ");
                }}
              >
                Quên mật khẩu?
              </Custom.Text>
            </View>
            <View style={style.vBottom2}>
              <Custom.Text
                style={[style.txtBottom, { paddingTop: 0, paddingBottom: 0 }]}
              >
                Bạn chưa có tài khoản?
              </Custom.Text>
              <Custom.Text
                style={[
                  style.txtBottom,
                  {
                    textDecorationLine: "underline",
                    textDecorationColor: colors.white,
                  },
                ]}
                onPress={() => this.props.navigation.navigate("Signup")}
              >
                ĐĂNG KÝ
              </Custom.Text>
            </View>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => ({
  location: state.user.location,
});

export default connect(
  mapStateToProps,
  {
    setUser: UserModel.setUser,
  },
)(Index);
