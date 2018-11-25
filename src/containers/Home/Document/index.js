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
} from "react-native";
import { Header, Modal } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { icons, colors } from "themes";
import { getRooms } from "actions/rooms";
import { UserModel } from "actions";
import { convertTime } from "utilities";
import coverDefault from "themes/default/cover/coverDefault";
import avatarDefault from "themes/default/avatar/avatarDefault";

type Props = {
  navigation: Object,
};

class Documents extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userData: [],
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
    firebase
      .firestore()
      .collection("contents")
      // .doc()
      .where("docId", "==", this.roomKey)
      .onSnapshot((snapshot) => {
        // console.log("Document data", snapshot.docChanges);
        const { docs } = snapshot;
        const data = [];
        const { size } = snapshot;
        docs.forEach(async (doc) => {
          const tmp = doc.data();
          const user = await UserModel.getUserById(tmp.userId);
          data.push({ ...tmp, user });
          if (data.length === size) {
            this.setState({ data }, () => {
              console.log("data: ", this.state.data);
            });
          }
        });
      });
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
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <Header
          iconLeft={null}
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
            console.log("click add");
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
        >
          <FlatList
            style={{ flex: 1 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.state.userData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  marginRight: 7,
                  backgroundColor: "red",
                }}
              />
            )}
          />
        </View>
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
                backgroundColor: colors.defaultOpacity,
                borderRadius: 5,
                justifyContent: "center",
                marginLeft: "5%",
                marginTop: 7,
              }}
            >
              <Text style={{ fontSize: 12 }} numberOfLines={1}>
                <Text style={{ fontWeight: "bold" }}>{item.user.name}</Text> -{" "}
                {convertTime(item.createtime)}
              </Text>
              <Text style={{ fontSize: 12, color: "white" }} numberOfLines={2}>
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Modal
          ref={(node) => {
            this.modal = node;
          }}
        >
          <View
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
                this.props.navigation.navigate("AddDocument", {
                  roomId: this.roomId,
                  roomKey: this.roomKey,
                });
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Thêm tốc ký</Text>
            </TouchableOpacity>
          </View>
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
