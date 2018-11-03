import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { images, colors } from "themes";
import UserModel from "actions/user";
import * as Custom from "components/CustomComponent";
import style from "./style";
import { checkInput, checkErrorCode, convertPhoneNumber11to10 } from "../check";

type Props = {
  navigation: Object,
  setUser: Function,
};

type State = {
  isSignup: boolean,
  isComfirm: boolean,
  comfirmCode: string,
  message: string,
  messageComfirm: string,
};

class Signup extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isSignup: false,
      isComfirm: false,
      message: "",
      messageComfirm: "",
    };
    this.comfirmCode = "-1";
  }
  /* eslint-disable */

  /* eslint-enable */
  verify = () => {
    // const { comfirmCode } = this.state;
    const { comfirmCode } = this;
    console.log(this.codeInput, comfirmCode);
    if (comfirmCode && this.codeInput) {
      this.setState(
        {
          isComfirm: true,
        },
        async () => {
          if (comfirmCode === this.codeInput) {
            await firebase
              .auth()
              .createUserAndRetrieveDataWithEmailAndPassword(
                `${this.tmpPhone}@gmail.com`,
                this.passwordText,
              )
              .then((user) => {
                const tokenId = user.user.getIdToken();
                const tmp = {
                  id: user.user.uid,
                  phone: this.tmpPhone,
                  photoUrl: "",
                  createtime: user.user.metadata.creationTime,
                  name: this.phoneText,
                  account: this.tmpPhone,
                  followed: [""],
                  following: [""],
                  gender: this.genText,
                  address: this.addressText,
                };
                this.user = tmp;
                this.modalVerify.close();
                this.props.setUser(tmp, tokenId, true);
                this.props.navigation.navigate("Home");
              })
              .catch((error) => {
                this.setState(
                  {
                    isComfirm: false,
                  },
                  () => {
                    const { code } = error;
                    console.log("error verifier: ", error);
                    const message = checkErrorCode(code);
                    this.setState(
                      {
                        message,
                      },
                      () => {
                        this.modalVerify.close();
                      },
                    );
                  },
                );
              });
            this.setState({
              isComfirm: false,
            });
          } else {
            this.setState({
              messageComfirm: "Mã xác nhận không đúng",
              isComfirm: false,
            });
          }
        },
      );
    } else {
      this.setState({
        messageComfirm: "Bạn cần phải nhập mã xác nhận",
        isComfirm: false,
      });
    }
  };
  phoneText: string;
  tmpPhone: string;
  passwordText: string;

  /**
   * Gửi mã xác thực về số điện thoại
   */
  sendCodeToPhone = () => {
    this.setState(
      {
        isSignup: true,
      },
      async () => {
        console.log(this.tmpPhone);
        firebase.auth().languageCode = "vi";
        await firebase
          .auth()
          .verifyPhoneNumber(this.tmpPhone)
          .on(
            "state_changed",
            async ({ state, code, error }) => {
              console.log(state, code, error);
              switch (state) {
                case firebase.auth.PhoneAuthState.CODE_SENT:
                  this.setState(
                    {
                      isSignup: false,
                    },
                    () => {
                      this.comfirmCode = code;
                      this.modalVerify.open();
                    },
                  );
                  break;
                case firebase.auth.PhoneAuthState.ERROR: // or "error"
                  console.log(error);
                  if (error === "auth/unknown") {
                    this.setState({
                      message: "Bạn cần kết nối mạng",
                      isSignup: false,
                    });
                  }
                  break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or "timeout"
                  // this.setState(
                  //   {
                  //     message: "Đã hết thời gian xác thực, vui lòng thử lại",
                  //     isSignup: false,
                  //   },
                  //   () => this.modalVerify.close(),
                  // );
                  break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                  console.log("auto");
                  this.comfirmCode = code;
                  this.codeInput = code;
                  this.verify();
                  break;
                default:
                  console.log(state);
              }
            },
            (error) => {
              console.log("send code error: ", error);
            },
          );
      },
    );
  };
  signUp = async () => {
    await this.setState({
      message: "",
      messageComfirm: "",
      isSignup: true,
    });
    const { result, message } = checkInput(
      this.phoneText,
      this.passwordText,
      this.comfirmText,
    );
    if (result) {
      this.tmpPhone = convertPhoneNumber11to10(this.phoneText);
      const query = firebase
        .database()
        .ref("user")
        .orderByChild("account")
        .equalTo(this.tmpPhone);
      try {
        const queryResult = await query.once("value");
        if (queryResult.val() === null) {
          this.sendCodeToPhone();
        } else {
          this.setState({
            isSignup: false,
            message: "Số điện thoại của bạn đã được đăng kí!",
          });
        }
      } catch (error) {
        console.log("signUp err: ", error);
      }
    } else {
      this.setState({
        isSignup: false,
        message,
      });
    }
  };

  render() {
    return (
      <ImageBackground source={images.background} style={style.container}>
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={style.form}>
            <Custom.TextInput
              ref={(phone) => {
                this.phone = phone;
              }}
              placeholder="Số điện thoại"
              onChangeText={(text) => {
                this.phoneText = text;
              }}
              style={style.input}
              returnKeyType="next"
              keyboardType="numeric"
              onFocus={() =>
                this.setState({
                  message: "",
                })
              }
              maxLength={14}
              onSubmitEditing={() => this.gender.focus()}
            />
            <Custom.TextInput
              ref={(gen) => {
                this.gender = gen;
              }}
              placeholder="Giới tính"
              onChangeText={(text) => {
                this.genText = text;
              }}
              style={style.input}
              returnKeyType="next"
              onSubmitEditing={() => this.address.focus()}
            />
            <Custom.TextInput
              ref={(address) => {
                this.address = address;
              }}
              placeholder="Địa chỉ"
              onChangeText={(text) => {
                this.addressText = text;
              }}
              style={style.input}
              returnKeyType="next"
              onSubmitEditing={() => this.password.focus()}
            />
            <Custom.TextInput
              ref={(pass) => {
                this.password = pass;
              }}
              placeholder="Mật khẩu"
              onChangeText={(text) => {
                this.passwordText = text;
              }}
              style={style.input}
              onFocus={() =>
                this.setState({
                  message: "",
                })
              }
              returnKeyType="next"
              secureTextEntry
              onSubmitEditing={() => this.comfirmPassword.focus()}
            />
            <Custom.TextInput
              ref={(comfirm) => {
                this.comfirmPassword = comfirm;
              }}
              placeholder="Nhập lại mật khẩu"
              onFocus={() =>
                this.setState({
                  message: "",
                })
              }
              onChangeText={(text) => {
                this.comfirmText = text;
              }}
              style={style.input}
              returnKeyType="done"
              secureTextEntry
              onSubmitEditing={this.signUp}
            />
            {this.state.message.length > 0 ? (
              <Custom.Text style={{ color: "red" }}>
                {this.state.message}
              </Custom.Text>
            ) : null}
            <TouchableOpacity style={style.btn} onPress={this.signUp}>
              {this.state.isSignup ? (
                <ActivityIndicator color="#2AB9B9" size="small" />
              ) : (
                <Custom.Text style={style.txtBtn}>Tiếp tục</Custom.Text>
              )}
            </TouchableOpacity>
            <View style={style.vBottom}>
              <Custom.Text style={style.txtBottom}>
                Bạn đã có tài khoản?
              </Custom.Text>
              <Custom.Text
                style={[
                  style.txtBottom,
                  {
                    textDecorationLine: "underline",
                    textDecorationColor: colors.white,
                    padding: 7,
                  },
                ]}
                onPress={() => this.props.navigation.navigate("Login")}
              >
                ĐĂNG NHẬP
              </Custom.Text>
            </View>
          </View>
        </ScrollView>
        <Custom.Modal
          ref={(modal) => {
            this.modalVerify = modal;
          }}
          style={style.modal}
        >
          <Custom.Text style={style.txtModal}>
            Mã xác nhận đã gửi về số điện thoại của bạn, vui lòng nhập mã để
            tiếp tục
          </Custom.Text>
          <TextInput
            placeholder="Nhập mã vào đây ..."
            style={style.inputModal}
            underlineColorAndroid="transparent"
            value={this.codeInput}
            onChangeText={(text) => {
              this.codeInput = text;
            }}
            onFocus={() => {
              this.codeInput = "";
            }}
            keyboardType="numeric"
            onSubmitEditing={this.verify}
          />
          {this.state.messageComfirm ? (
            <Custom.Text style={[style.txtModal, { color: "red" }]}>
              {this.state.messageComfirm}
            </Custom.Text>
          ) : null}
          <TouchableOpacity
            style={style.btnModal}
            onPress={!this.state.isComfirm ? this.verify : () => {}}
          >
            {this.state.isComfirm ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Custom.Text style={style.txtBtnModal} onPress={this.verify}>
                Tiếp tục
              </Custom.Text>
            )}
          </TouchableOpacity>
        </Custom.Modal>
      </ImageBackground>
    );
  }
}
/* eslint-disable */

export default connect(
  null,
  {
    setUser: UserModel.setUser,
  },
)(Signup);
