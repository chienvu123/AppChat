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

class History extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      size: 0,
    };
    const type = props.navigation.getParam("type", "room");
    const roomId = props.navigation.getParam("roomId", "");
    const roomKey = props.navigation.getParam("roomKey", "");
    this.type = type;
    if (type === "Document") {
      this.item = props.navigation.getParam("item", {});
    }
    this.roomId = roomId;
    this.roomKey = roomKey;
  }

  componentDidMount() {
    if (this.type !== "Document") {
      this.getData();
    } else {
      this.getDocument();
    }
  }

  getData = () => {
    firebase
      .firestore()
      .collection("docs")
      .doc(this.roomKey)
      .collection("updates")
      .orderBy("createtime")
      .get()
      .then((value) => {
        const data = [];
        let { docs } = value;
        docs = docs.reverse();
        const { size } = value;
        if (size !== 0) {
          docs.forEach(async (doc) => {
            const tmp = doc.data();
            const user = await UserModel.getUserById(tmp.userId);
            data.push({ ...tmp, user, id: doc.id });
            if (data.length === size) {
              this.setState({ data, isLoading: false, size });
            }
          });
        } else {
          this.setState({ isLoading: false, size });
        }
      })
      .catch((error) => {
        console.log("get updates error: ", error);
      });
  };
  getDocument = () => {
    firebase
      .firestore()
      .collection("docs")
      .doc(this.roomKey)
      .collection("contents")
      .doc(this.item.id)
      .collection("updates")
      .orderBy("createtime")
      .get()
      .then((value) => {
        const data = [];
        let { docs } = value;
        docs = docs.reverse();
        const { size } = value;
        if (size !== 0) {
          docs.forEach(async (doc) => {
            const tmp = doc.data();
            const user = await UserModel.getUserById(tmp.userId);
            data.push({ ...tmp, user, id: doc.id });
            if (data.length === size) {
              this.setState({ data, isLoading: false, size });
            }
          });
        } else {
          this.setState({ isLoading: false, size });
        }
      })
      .catch((error) => {
        console.log("get updates error: ", error);
      });
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
          center="Lịch sử chỉnh sửa"
        />
        {/* eslint-disable */}
        {!isLoading ? (
          size > 0 ? (
            <FlatList
              style={{ flex: 1 }}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "90%",
                    // height: 36,
                    paddingVertical: 5,
                    paddingLeft: 5,
                    backgroundColor: colors.orange,
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
                  {this.type !== "Document" ? (
                    <Text
                      style={{ fontSize: 12, color: "white" }}
                      numberOfLines={2}
                    >
                      Tên phòng: {item.title}
                    </Text>
                  ) : null}
                  {this.type !== "Document" ? (
                    <Text
                      style={{ fontSize: 12, color: "white" }}
                      numberOfLines={2}
                    >
                      Mô tả phòng: {item.describle}
                    </Text>
                  ) : null}
                  {this.type === "Document" ? (
                    <Text
                      style={{ fontSize: 12, color: "white" }}
                      numberOfLines={2}
                    >
                      Nội dung: {item.content}
                    </Text>
                  ) : null}
                </View>
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
              <Text>Không có chỉnh sửa gì</Text>
            </View>
          )
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="small" color={colors.default} />
          </View>
        )}
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
)(History);
