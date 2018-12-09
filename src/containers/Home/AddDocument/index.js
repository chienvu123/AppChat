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
import style from "./style";

type Props = {
  navigation: Object,
  userOwner: User,
};

class AddRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
    };
    this.roomId = props.navigation.getParam("roomId", "");
    this.roomKey = props.navigation.getParam("roomKey", "");
    this.isEdit = props.navigation.getParam("isEdit", false);
    this.item = props.navigation.getParam("item", {});
  }
  componentDidMount() {
    const createtime = new Date().getTime();
    const userId = this.props.userOwner.id;
    const data = {
      createtime,
      userId,
      status: -1,
      docId: this.roomKey,
    };
    const path = firebase
      .firestore()
      .collection("docs")
      .doc(this.roomKey)
      .collection("contents");
    this.pathContent = path;
    if (!this.isEdit) {
      path.add(data).then((value) => {
        this.id = value.id;
        this.query = path.doc(this.id);
      });
    } else {
      this.query = path.doc(this.item.id);
      this.query
        .update({
          status: 1,
        })
        .catch((error) => {
          console.log("update error: ", error);
        });
    }

    this.backListen = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backHandler,
    );
  }
  componentWillUnmount() {
    this.backListen.remove();
  }
  addDocument = async () => {
    const endtime = new Date().getTime();
    this.setState({ isAdding: true });
    let data = null;
    if (!this.isEdit) {
      data = {
        endtime,
        status: 0,
        content: this.describle,
      };
    } else {
      data = {
        status: 2,
        content: this.describle,
        userId: this.props.userOwner.id,
      };
    }
    try {
      await this.query.update(data);
      this.query.collection("updates").add({
        userId: this.props.userOwner.id,
        createtime: endtime,
        content: this.describle,
      });
      this.setState({ isAdding: false });
      this.props.navigation.goBack();
    } catch (error) {
      console.log("Add error: ", error);
      Alert.alert("Lỗi: ", error);
      this.setState({ isAdding: false });
    }
  };
  check = () => {
    if (!this.state.isAdding) {
      if (this.describle) {
        if (this.isEdit) {
          if (this.describle !== this.item.content) {
            this.addDocument();
          } else {
            Alert.alert("Lưu ý: ", "Bạn chưa thay đổi gì");
          }
        } else {
          this.addDocument();
        }
      } else {
        Alert.alert("Lưu ý: ", "Bạn không được để trống nội dung");
      }
    }
  };
  remove = () => {
    if (this.isEdit) {
      this.query.update({
        status: this.item.status,
      });
    } else {
      this.query.delete();
    }
  };
  backHandler = () => {
    const { isAdding } = this.state;
    let check = true;
    if (!isAdding) {
      this.remove();
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        "Lưu ý: ",
        "Hành động chưa hoàn thành, bạn có muốn hủy",
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
        {
          cancelable: false,
          onDismiss: () => {
            console.log("alert dismiss");
          },
        },
      );
    }
    return check;
  };
  render() {
    const { userOwner } = this.props;
    const { isAdding } = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <Header
          onLeftPress={this.backHandler}
          center="Thêm tốc kí"
          onRightPress={() => {
            console.log("click add");
          }}
        />
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
                  {userOwner.name}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={style.col1}>Ngày tạo: </Text>
                <Text style={style.col2} numberOfLines={1}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              <View style={style.row}>
                <Text style={style.col1}>Mã phòng:</Text>
                <Text style={style.col2} numberOfLines={1}>
                  {this.roomId}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  marginTop: 7,
                  backgroundColor: "white",
                  paddingLeft: 10,
                }}
              >
                <Text style={{ width: "30%" }}>Nội dung:</Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 0,
                    paddingLeft: 7,
                    marginTop: 7,
                    height: 100,
                  }}
                  placeholder="nội dung muốn thêm ..."
                  defaultValue={this.isEdit ? this.item.content : null}
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
