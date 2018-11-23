import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { connect } from "react-redux";
import { Custom } from "components";
import avatarDefault from "themes/default/avatar/avatarDefault";
import coverDefault from "themes/default/cover/coverDefault";
import { UserModel } from "actions";
import { colors } from "themes";
import style from "./style";

const url =
  "https://graph.facebook.com/v3.1/me?fields=name,email,birthday,hometown,gender,picture&access_token";

type Props = {
  navigation: Object,
  setUser: Function,
};

class LinkApp extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.user = this.props.navigation.getParam("user", {});
    this.account = this.props.navigation.getParam("account", {});
    this.tokenId = this.props.navigation.getParam("tokenId", "");
    this.state = {};
  }

  getFacebookInfo = () => {
    LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
          console.log("cancel");
        } else {
          AccessToken.getCurrentAccessToken().then(async (data) => {
            const response = await fetch(`${url}=${data.accessToken}`);
            const json = await response.json();
            const tmp = {
              avatar: {
                photoUrl: json.picture.data.url,
              },
              name: json.name,
              email: json.email,
            };
            this.user = {
              ...this.user,
              ...tmp,
            };
            this.skipLink();
          });
        }
      },
      (error) => {
        console.log("Sign in error", error);
      },
    );
  };
  skipLink = () => {
    this.createUser();
  };
  createUser = () => {
    const { user, account, tokenId } = this;
    if (!user.avatar) {
      user.avatarDefault = this.randomAvatar();
    }
    if (!user.cover) {
      user.coverDefault = this.randomCover();
    }
    this.props.setUser(user, tokenId, account);
    this.props.navigation.navigate("Home");
  };
  randomAvatar = () => {
    const { length } = Object.keys(avatarDefault);
    const index = Math.round(Math.random() * (length - 1));
    return index;
  };
  randomCover = () => {
    const { length } = Object.keys(coverDefault);
    const index = Math.round(Math.random() * (length - 1));
    return index;
  };
  render() {
    return (
      <View style={style.container}>
        <Custom.Text style={style.txtModal}>
          {"Bạn có muốn \n liên kết tài khoản không?"}
        </Custom.Text>
        <TouchableOpacity
          style={[style.btnModal, { backgroundColor: "#3B579D" }]}
          onPress={this.getFacebookInfo}
        >
          <Text style={style.txtBtnModal}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.btnModal, { backgroundColor: "#F5511E" }]}
        >
          <Text style={style.txtBtnModal}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            style.btnModal,
            { backgroundColor: colors.white, marginTop: 50 },
          ]}
          onPress={this.skipLink}
        >
          <Text style={[style.txtBtnModal, { color: "#01579b" }]}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  location: state.location,
});

export default connect(
  mapStateToProps,
  {
    setUser: UserModel.setUser,
  },
)(LinkApp);
