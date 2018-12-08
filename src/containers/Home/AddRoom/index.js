/**
 * @flow
 */
import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Header } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { colors } from "themes";
import { User } from "constants/dataType";
import { randomRoomId } from "utilities/random";
import style from "./style";

type Props = {
  navigation: Object,
  userOwner: User,
};

class AddRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    console.log("param: ", params);
    this.param = params;
    if (params !== undefined) {
      this.title = this.param.item.title;
      this.describle = this.param.item.describle;
      this.title1 = this.title;
      this.describle1 = this.describle;
    } else {
      this.title = null;
      this.describle = null;
    }
    this.state = {
      isAdding: false,
    };
  }
  componentDidMount() {
    if (!this.param) {
      const createtime = new Date().getTime();
      const userId = this.props.userOwner.id;
      const roomId = randomRoomId();
      const data = {
        createtime,
        userId,
        status: -1,
        roomId,
      };
      firebase
        .firestore()
        .collection("docs")
        .add(data)
        .then((value) => {
          this.roomId = value.id;
        });
    } else {
      const path = firebase
        .firestore()
        .collection("docs")
        .doc(this.param.item.roomKey);
      path.update({
        status: 1,
      });
      this.path = path;
    }
    this.backListen = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backHandler,
    );
  }
  backHandler = () => {
    const { isAdding } = this.state;
    let check = true;
    if (!isAdding) {
      this.remove();
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        "Lưu ý: ",
        "Hành động chưa hoàn thành, bạn có muốn hủy không?",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              this.remove();
              this.props.navigation.goBack();
            },
          },
          {
            text: "Hủy bỏ",
            style: "cancel",
            onPress: () => {
              check = false;
            },
          },
        ],
      );
    }
    return check;
  };
  addRoom = () => {
    this.setState({ isAdding: true });
    if (!this.param) {
      const data = {
        title: this.title,
        describle: this.describle,
        status: 0,
      };
      firebase
        .firestore()
        .collection("docs")
        .doc(this.roomId)
        .update(data)
        .then(
          () => {
            this.setState({ isAdding: false });
            this.props.navigation.goBack();
          },
          (error) => {
            this.setState({ isAdding: false });
            Alert.alert("Lỗi: ", error);
          },
        )
        .catch((error) => {
          console.log("Add error: ", error);
          this.setState({ isAdding: false });
        });
    } else if (
      this.title !== this.title1 ||
      this.describle !== this.describle1
    ) {
      const data = {
        userId: this.props.userOwner.id,
        title: this.title,
        describle: this.describle,
        createtime: new Date().getTime(),
      };
      let index = 0;
      this.path
        .collection("updates")
        .add(data)
        .then(() => {
          index++;
          if (index === 2) this.props.navigation.goBack();
        });
      this.path
        .update({
          status: 2,
          title: this.title,
          describle: this.describle,
        })
        .then(() => {
          index++;
          if (index === 2) this.props.navigation.goBack();
        });
    } else {
      Alert.alert("Lưu ý: ", "bạn chưa chỉnh sửa gì");
    }
  };
  check = () => {
    if (this.title) {
      if (this.describle) {
        this.addRoom();
      } else {
        Alert.alert("Lưu ý: ", "Bạn không được để trống mô tả");
      }
    } else {
      Alert.alert("Lưu ý: ", "Bạn không được để trống tên phòng");
    }
  };
  remove = () => {
    if (!this.param) {
      firebase
        .firestore()
        .collection("docs")
        .doc(this.roomId)
        .delete();
    } else {
      this.path.update({
        status: 0,
      });
    }
  };

  render() {
    const { userOwner } = this.props;
    const { isAdding } = this.state;
    const item = this.param ? this.param.item : null;
    const user = this.param ? item.user : userOwner;
    const dateStr = this.param
      ? new Date(item.createtime).toLocaleDateString()
      : new Date().toLocaleDateString();
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <Header onLeftPress={this.backHandler} center="Tạo phòng" />
        <KeyboardAvoidingView behavior="padding">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              <View style={style.row}>
                <Text style={style.col1}>Người tạo: </Text>
                <Text style={style.col2} numberOfLines={1}>
                  {user.name}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={style.col1}>Ngày tạo: </Text>
                <Text style={style.col2} numberOfLines={1}>
                  {dateStr}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={{ width: "30%" }}>Tên phòng:</Text>
                <TextInput
                  style={{
                    width: "65%",
                    height: 44,
                    marginLeft: "5%",
                    padding: 0,
                  }}
                  defaultValue={item ? item.title : null}
                  placeholder="phòng họp ..."
                  onChangeText={(text) => {
                    this.title = text;
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  marginTop: 7,
                  backgroundColor: "white",
                  paddingLeft: 10,
                }}
              >
                <Text style={{ width: "30%" }}>Mô tả:</Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 0,
                    paddingLeft: 7,
                    marginTop: 7,
                    height: 100,
                  }}
                  defaultValue={item ? item.describle : null}
                  placeholder="mô tả phòng họp ..."
                  onChangeText={(text) => {
                    this.describle = text;
                  }}
                  multiline
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                width: "100%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "50%",
                  height: 44,
                  backgroundColor: colors.green,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={this.check}
              >
                {!isAdding ? (
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Xong
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color="white" />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.user;
  return {
    userOwner: user,
  };
};

export default connect(mapStateToProps)(AddRoom);
