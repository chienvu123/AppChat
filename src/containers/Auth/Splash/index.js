/**
 * @flow
 */
import React, { PureComponent } from "react";
import {
  ImageBackground,
  StatusBar,
  NetInfo,
  AsyncStorage,
  Alert,
  Text,
} from "react-native";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { images } from "themes";
import UserModel from "actions/user";
import style from "./style";

type Props = {
  setUser: Function,
  navigation: Object,
};

class Splash extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange,
    );
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange,
    );
  }
  handleFirstConnectivityChange = async (isConnected) => {
    if (!isConnected) {
      Alert.alert("Lưu ý: ", "Bạn cần kết nối internet để sử dụng ứng dụng.", [
        { text: "Đồng ý" },
      ]);
    } else {
      const tmp = await AsyncStorage.getItem("userId");
      console.log("begin");
      if (tmp) {
        this.userId = tmp;
        firebase
          .database()
          .ref("user")
          .child(this.userId)
          .once("value", (snapshot) => {
            this.props.setUser({
              ...snapshot.val(),
            });
            this.props.navigation.navigate("Home");
          });
      } else {
        setTimeout(() => {
          this.props.navigation.navigate("Login0");
        }, 250);
      }
    }
  };

  render() {
    return (
      <ImageBackground source={images.background} style={style.container}>
        <StatusBar hidden />
        <ImageBackground
          source={images.logo}
          style={style.logo}
          resizeMethod="resize"
          resizeMode="contain"
        />
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
          HMCA
        </Text>
      </ImageBackground>
    );
  }
}

export default connect(
  null,
  {
    setUser: UserModel.setUser,
  },
)(Splash);
