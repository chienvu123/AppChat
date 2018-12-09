import React, { PureComponent } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { images, colors } from "themes";
import { Custom } from "components";
import style from "./style";
import { checkInput, checkErrorCode, convertPhoneNumber11to10 } from "../check";

type Props = {
  navigation: Object,
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
    this.verificationId = "";
  }
  otherPhoneVerify = () => {
    const { codeInput } = this;
    if (codeInput && codeInput.length === 6) {
      this.setState(
        {
          isComfirm: true,
        },
        () => {
          const credential = firebase.auth.PhoneAuthProvider.credential(
            this.verificationId,
            codeInput,
          );
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then((userCredential) => {
              console.log("comfirm success:", userCredential);
              this.createAccount();
            })
            .catch((error) => {
              console.log("otherPhone error: ", error);
              this.setState({ messageComfirm: "Mã xác thực không đúng" });
            });
        },
      );
    } else {
      this.setState({
        messageComfirm: "Bạn cần phải nhập mã xác nhận",
        isComfirm: false,
      });
    }
  };
  createAccount = async () => {
    this.setState(
      {
        isComfirm: true,
      },
      async () => {
        await firebase
          .auth()
          .createUserAndRetrieveDataWithEmailAndPassword(
            `${this.tmpPhone}@gmail.com`,
            this.passwordText,
          )
          .then((user) => {
            console.log("createAccount: ", user);
            this.createUser(user);
          })
          .catch((error) => {
            this.codeInput = "";
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
      },
    );
  };
  createUser = async (user) => {
    console.log("createUser: ", user);
    const tokenId = await user.user.getIdToken();
    const tmp = {
      id: user.user.uid,
      phone: this.tmpPhone,
      // photoUrl: "",
      createtime: user.user.metadata.creationTime,
      name: this.phoneText,
      gender: this.genText,
      address: this.addressText,
    };
    this.user = tmp;
    this.modalVerify.close();
    console.log("navigate to LinkApp");
    this.props.navigation.navigate("LinkApp", {
      user: this.user,
      tokenId,
      account: { account: this.tmpPhone, password: this.passwordText },
    });
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
        firebase.auth().languageCode = "vi";
        await firebase
          .auth()
          .verifyPhoneNumber(this.tmpPhone, 60)
          .on(
            "state_changed",
            async (snapshot) => {
              const { state, code, error } = snapshot;
              console.log(snapshot);
              switch (state) {
                case firebase.auth.PhoneAuthState.CODE_SENT:
                  this.setState(
                    {
                      isSignup: false,
                    },
                    () => {
                      this.verificationId = snapshot.verificationId;
                      this.modalVerify.open();
                    },
                  );
                  break;
                case firebase.auth.PhoneAuthState.ERROR: {
                  // or "error"
                  const msgError = error.message;
                  if (msgError.search("network") !== -1) {
                    this.setState({
                      message: "Bạn cần kết nối mạng",
                      isSignup: false,
                    });
                  }
                  if (msgError.search("blocked") !== -1) {
                    this.setState({
                      message:
                        "Chức năng đăng kí đang được bảo trì, mong bạn quay lại sau",
                      isSignup: false,
                    });
                  }
                  break;
                }
                case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or "timeout"
                  // TODO
                  break;
                case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                  console.log("auto");
                  // this.comfirmCode = code;
                  this.codeInput = code;
                  this.createAccount();
                  break;
                default:
                  console.log(state);
              }
            },
            (error) => {
              console.log("send code error: ", error);
            },
            (snapshot) => {
              // this.comfirmCode = snapshot.code;
              console.log("success: ", snapshot);
            },
          );
      },
    );
  };
  checkSignuping = () => {
    if (!this.state.isSignup) {
      this.signUp();
    }
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
      await firebase
        .firestore()
        .collection("account")
        .where("account", "=", this.tmpPhone)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log("check success: ");
            this.sendCodeToPhone();
          } else {
            this.setState({
              message: "Tài khoản đã được đăng ký.",
              isSignup: false,
            });
          }
        })
        .catch((error) => {
          console.log("error login: ", error);
          this.setState({
            message: "Tài khoản không đúng",
            isSignup: false,
          });
        });
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={{ width: "100%", height: "100%" }}
            keyboardShouldPersistTaps="handled"
            ref={(node) => {
              this.scrollView = node;
            }}
            showsVerticalScrollIndicator={false}
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
                onFocus={() => {
                  this.setState(
                    {
                      message: "",
                    },
                    () => {
                      // this.scrollView.scrollTo;
                    },
                  );
                }}
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
                onSubmitEditing={this.checkSignuping}
              />
              {this.state.message.length > 0 ? (
                <Custom.Text style={{ color: "red" }}>
                  {this.state.message}
                </Custom.Text>
              ) : null}
              <TouchableOpacity style={style.btn} onPress={this.checkSignuping}>
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
        </KeyboardAvoidingView>
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
            defaultValue={this.codeInput}
            onChangeText={(text) => {
              this.codeInput = text;
            }}
            onFocus={() => {
              this.codeInput = "";
            }}
            keyboardType="numeric"
            onSubmitEditing={this.otherPhoneVerify}
          />
          {this.state.messageComfirm ? (
            <Custom.Text style={[style.txtModal, { color: "red" }]}>
              {this.state.messageComfirm}
            </Custom.Text>
          ) : null}
          <TouchableOpacity
            style={style.btnModal}
            onPress={!this.state.isComfirm ? this.otherPhoneVerify : () => {}}
          >
            {this.state.isComfirm ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Custom.Text style={style.txtBtnModal}>Tiếp tục</Custom.Text>
            )}
          </TouchableOpacity>
        </Custom.Modal>
      </ImageBackground>
    );
  }
}

/* eslint-disable */

const mapStateToProps = (state) => ({
  location: state.user.location,
});

export default connect(mapStateToProps)(Signup);

// timeout

// this.setState(
//   {
//     message: "Đã hết thời gian xác thực, vui lòng thử lại",
//     isSignup: false,
//   },
//   () => this.modalVerify.close(),
// );

// signup

// const query = firebase
//   .database()
//   .ref("user")
//   .orderByChild("account")
//   .equalTo(this.tmpPhone);
// try {
//   const queryResult = await query.once("value");
//   if (queryResult.val() === null) {
//     this.sendCodeToPhone();
//   } else {
//     this.setState({
//       isSignup: false,
//       message: "Số điện thoại của bạn đã được đăng kí!",
//     });
//   }
// } catch (error) {
//   console.log("signUp err: ", error);
// }
