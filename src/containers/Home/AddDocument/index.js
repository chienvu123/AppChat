/**
 * @flow
 */
import React, { PureComponent } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ActivityIndicator,
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
    this.state = {
      isAdding: false,
    };
  }
  componentDidMount() {
    const createtime = new Date().getTime();
    const userId = this.props.userOwner.id;
    const roomId = randomRoomId();
    const data = {
      createtime,
      userId,
      status: 0,
      roomId,
    };
    firebase
      .firestore()
      .collection("docs")
      .add(data)
      .then((value) => {
        this.roomId = value.id;
      });
  }
  addRoom = () => {
    this.setState({ isAdding: true });
    const data = {
      title: this.title,
      describle: this.describle,
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
    firebase
      .firestore()
      .collection("docs")
      .doc(this.roomId)
      .delete();
  };
  backHandler = () => {
    const { isAdding } = this.state;
    if (!isAdding) {
      this.remove();
      this.props.navigation.goBack();
    } else {
      Alert.alert("Lưu ý: ", "Bạn đang tạo phòng, bạn có muốn hủy", [
        {
          text: "Đồng ý",
          onPress: () => {
            this.remove();
            this.props.navigation.goBack();
          },
        },
      ]);
    }
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
          center="Tạo phòng"
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
                <Text style={{ width: "30%" }}>Tên phòng:</Text>
                <TextInput
                  style={{
                    width: "65%",
                    height: 44,
                    marginLeft: "5%",
                    padding: 0,
                  }}
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
