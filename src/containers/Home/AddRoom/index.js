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
  Picker,
} from "react-native";
import { Header } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { colors } from "themes";
import { User } from "constants/dataType";
import { randomRoomId } from "utilities/random";
import style from "./style";
import { convertPhoneNumber11to10 } from "../../Auth/check";
import { compareArray } from "./compare";

type Props = {
  navigation: Object,
  userOwner: User,
};

class AddRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    this.param = params;
    let check = false;
    this.tmpPhone = this.props.userOwner.phone;
    this.tmpPhone = this.props.userOwner.phone.replace("+84", "0");
    this.pickerValue = "all";
    if (params !== undefined) {
      this.title = this.param.item.title;
      this.describle = this.param.item.describle;
      this.arrUserAdd = this.param.item.follow;
      this.userIdOwner = this.param.item.userId;
      if (this.arrUserAdd) {
        check = true;
        this.pickerValue = "limit";
      }
      this.title1 = this.title;
      this.describle1 = this.describle;
    } else {
      this.title = null;
      this.describle = null;
    }
    this.arrUser = [this.tmpPhone];
    this.state = {
      isAdding: false,
      pickerValue: check ? "limit" : "all",
      arrAdd: [this.tmpPhone],
      itemAdd: "",
      title: this.title,
      describle: this.describle,
      isAddUser: false,
    };
  }
  componentDidMount() {
    if (!this.arrUserAdd) {
      this.arrUserAdd = {};
      this.arrUserAdd[this.props.userOwner.id] = this.tmpPhone;
      console.log(this.arrUserAdd, this.tmpPhone);
    }
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
      const path = firebase.firestore().collection("docs");
      path
        .add(data)
        .then((value) => {
          this.roomId = value.id;
          this.path = path.doc(value.id);
        })
        .catch((error) => {
          console.log("initial room error: ", error);
        });
    } else {
      if (this.pickerValue === "limit") {
        this.convertUserAdd();
      }
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
  componentWillUnmount() {
    this.backListen.remove();
  }
  convertUserAdd = () => {
    const keys = Object.keys(this.arrUserAdd);
    const arr = [];
    keys.forEach((key) => {
      arr.push(this.arrUserAdd[key]);
    });
    this.arrUser = arr;
    this.setState({ arrAdd: arr });
  };
  addUserLimit = async () => {
    this.setState({ isAddUser: true });
    const { itemAdd, arrAdd } = this.state;
    const tmp = convertPhoneNumber11to10(itemAdd);
    try {
      const value = await firebase
        .firestore()
        .collection("account")
        .where("account", "==", tmp)
        .get();
      if (value.size > 0) {
        arrAdd.push(itemAdd);
        const userId = value.docs[0].id;
        this.arrUserAdd[userId] = itemAdd;
        this.setState({
          arrAdd,
          itemAdd: "",
          isAddUser: false,
        });
      } else {
        this.setState({ isAddUser: false });
        Alert.alert("Lỗi: ", "Số điện thoại không tồn tại");
      }
    } catch (error) {
      console.log("check addUser err", error);
      this.setState({ isAddUser: false });
      Alert.alert("Lỗi: ", "Số điện thoại không tồn tại");
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
        follow: this.state.pickerValue === "limit" ? this.arrUserAdd : null,
        status: 0,
      };
      this.path
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
      this.describle !== this.describle1 ||
      !compareArray(this.arrUser, this.state.arrAdd) ||
      this.pickerValue !== this.state.pickerValue
    ) {
      const data = {
        userId: this.props.userOwner.id,
        title: this.title,
        describle: this.describle,
        follow: this.state.pickerValue === "limit" ? this.arrUserAdd : null,
        createtime: new Date().getTime(),
      };
      let index = 0;
      this.path
        .collection("updates")
        .add(data)
        .then(() => {
          index++;
          if (index === 2) this.props.navigation.goBack();
        })
        .catch((err) => {
          console.log(err);
        });
      this.path
        .update({
          status: 2,
          title: this.title,
          describle: this.describle,
          follow: this.state.pickerValue === "limit" ? this.arrUserAdd : null,
        })
        .then(() => {
          index++;
          if (index === 2) this.props.navigation.goBack();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({ isAdding: false });
      Alert.alert("Lưu ý: ", "Bạn chưa chỉnh sửa gì");
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
      this.path.delete();
    } else {
      this.path.update({
        status: this.param.item.status,
      });
    }
  };

  render() {
    const { userOwner } = this.props;
    const {
      isAdding,
      title,
      describle,
      pickerValue,
      arrAdd,
      itemAdd,
      isAddUser,
    } = this.state;
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
                <Text
                  style={{ width: "30%", fontWeight: "bold", color: "black" }}
                >
                  Tên phòng:
                </Text>
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
                    this.setState({
                      title: text,
                    });
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
                <Text
                  style={{ width: "30%", fontWeight: "bold", color: "black" }}
                >
                  Mô tả:
                </Text>
                <TextInput
                  style={{
                    width: "100%",
                    padding: 0,
                    paddingLeft: 10,
                    marginTop: 7,
                    height: 100,
                  }}
                  defaultValue={item ? item.describle : null}
                  placeholder="mô tả phòng họp ..."
                  onChangeText={(text) => {
                    this.describle = text;
                    this.setState({
                      describle: text,
                    });
                  }}
                  multiline
                />
              </View>
            </View>
            {userOwner.id === user.id ? (
              <View style={{ width: "100%" }}>
                <View style={style.row}>
                  <Text style={style.col1}>Chia sẻ</Text>
                  <Picker
                    style={style.col2}
                    mode="dropdown"
                    onValueChange={(itemValue) => {
                      this.setState({
                        pickerValue: itemValue,
                      });
                    }}
                    selectedValue={pickerValue}
                  >
                    <Picker.Item value="all" label="Tất cả" />
                    <Picker.Item value="limit" label="Giới hạn" />
                  </Picker>
                </View>
                {pickerValue === "limit" ? (
                  <View style={{ paddingLeft: 10 }}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <TextInput
                        style={{ width: "60%", height: 50, paddingLeft: 10 }}
                        keyboardType="numeric"
                        placeholder="Nhập số điện thoại muốn thêm"
                        value={itemAdd}
                        onChangeText={(text) => {
                          this.setState({ itemAdd: text });
                        }}
                        onSubmitEditing={this.addUserLimit}
                        maxLength={11}
                      />
                      <TouchableOpacity
                        style={{
                          width: "30%",
                          marginLeft: "5%",
                          height: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: itemAdd.length === 10 ? 1 : 0.5,
                        }}
                        hitSlop={{
                          top: 10,
                          bottom: 10,
                          left: 10,
                          right: 10,
                        }}
                        disabled={!(itemAdd.length === 10)}
                        onPress={this.addUserLimit}
                      >
                        {!isAddUser ? (
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: itemAdd.length === 10 ? "green" : "gray",
                            }}
                          >
                            Thêm
                          </Text>
                        ) : (
                          <ActivityIndicator size="small" color="green" />
                        )}
                      </TouchableOpacity>
                    </View>
                    {arrAdd.map((value, index) => (
                      <Text
                        style={{ marginTop: 7, color: "black" }}
                        key={index.toString()}
                      >
                        - {value} {value === this.tmpPhone ? "(Bạn)" : ""}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
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
                  opacity: title && describle ? 1 : 0.5,
                }}
                onPress={this.check}
                disabled={!title || !describle}
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
