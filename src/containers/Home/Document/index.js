/**
 * @flow
 */
import React, { PureComponent } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Header, Modal } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { icons } from "themes";
import { getRooms } from "actions/rooms";
import { UserModel } from "actions";
import { convertTime } from "utilities";
import coverDefault from "themes/default/cover/coverDefault";
import avatarDefault from "themes/default/avatar/avatarDefault";
import colors, { renderColor } from "themes/Colors";

type Props = {
  navigation: Object,
};

class Documents extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userData: [],
      isLoading: true,
      size: 0,
    };
    const roomId = props.navigation.getParam("roomId", "");
    const roomKey = props.navigation.getParam("roomKey", "");
    this.roomId = roomId;
    this.roomKey = roomKey;
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    console.log("roomkey: ", this.roomKey);
    const path = firebase
      .firestore()
      .collection("contents")
      .where("docId", "=", this.roomKey);
    console.log("path: ", path);
    firebase
      .firestore()
      .collection("contents")
      // .doc()
      .where("docId", "==", this.roomKey)
      // .orderBy("createtime")
      .onSnapshot(
        (snapshot) => {
          console.log("snapshot: ", snapshot);
          // console.log("Document data", snapshot.docChanges);
          let { docs } = snapshot;
          docs = docs.reverse();
          const data = [];
          const { size } = snapshot;
          console.log(size);
          if (size !== 0) {
            docs.forEach(async (doc) => {
              const tmp = doc.data();
              const user = await UserModel.getUserById(tmp.userId);
              data.push({ ...tmp, user });
              if (data.length === size) {
                this.setState({ data, isLoading: false, size }, () => {
                  console.log("data: ", this.state.data);
                });
              }
            });
          } else {
            this.setState({ isLoading: false, size });
          }
        },
        (error) => {
          console.log("err: ", error);
        },
      );
  };
  randomCover = () => {
    const index = this.userProfile.coverDefault;
    return coverDefault[`anh${index}`];
  };
  randomAvatar = () => {
    const index = this.userProfile.avatarDefault;
    return avatarDefault[`anh${index}`];
  };
  render() {
    const { isLoading, size } = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <Header
          onLeftPress={() => this.props.navigation.goBack()}
          iconRight={
            <ImageBackground
              source={icons.add}
              style={{
                width: 30,
                height: 30,
              }}
            />
          }
          center={`Phòng - ${this.roomId}`}
          onRightPress={() => {
            this.modal.open();
          }}
        />
        <View
          style={{
            width: "100%",
            height: 56,
            paddingHorizontal: "3%",
            justifyContent: "center",
            // elevation: 5,
            backgroundColor: "white",
          }}
        />
        {/* eslint-disable */}
        {!isLoading ? (
          size > 0 ? (
            <FlatList
              style={{ flex: 1 }}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    width: "90%",
                    // height: 36,
                    paddingVertical: 5,
                    paddingLeft: 5,
                    backgroundColor: renderColor(item.status),
                    borderRadius: 5,
                    justifyContent: "center",
                    marginLeft: "5%",
                    marginTop: 7,
                  }}
                >
                  <Text style={{ fontSize: 12 }} numberOfLines={1}>
                    <Text style={{ fontWeight: "bold" }}>{item.user.name}</Text>{" "}
                    - {convertTime(item.createtime)}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "white" }}
                    numberOfLines={2}
                  >
                    {item.status !== -1 ? item.content : "Đang khởi tạo ... "}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Chưa có văn bản nào được ghi</Text>
            </View>
          )
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="small" color={colors.default} />
          </View>
        )}
        <Modal
          ref={(node) => {
            this.modal = node;
          }}
          style={{
            width: "96%",
            backgroundColor: "white",
            height: 150,
            borderRadius: 15,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 15,
              borderBottomColor: "grey",
              borderBottomWidth: 1,
            }}
            onPress={() => {
              this.modal.close();
              this.modal1.open();
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Thêm văn bản</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 15,
            }}
            onPress={() => {
              this.modal.close();
              this.props.navigation.navigate("Template", {
                data: this.state.data,
              });
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Xuất văn bản</Text>
          </TouchableOpacity>
        </Modal>
        <Modal
          ref={(node) => {
            this.modal1 = node;
          }}
          style={{
            width: "96%",
            backgroundColor: "white",
            height: 150,
            borderRadius: 15,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 15,
              borderBottomColor: "grey",
              borderBottomWidth: 1,
            }}
            onPress={() => {
              this.modal.close();
              this.props.navigation.navigate("Home", {
                roomId: this.roomId,
                roomKey: this.roomKey,
              });
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Thêm bằng file</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 15,
            }}
            onPress={() => {
              this.modal.close();
              this.props.navigation.navigate("AddDocument", {
                roomId: this.roomId,
                roomKey: this.roomKey,
              });
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Thêm tốc ký</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.rooms.data,
});

export default connect(
  mapStateToProps,
  {
    getRooms,
  },
)(Documents);
