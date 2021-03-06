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
import { icons, colors } from "themes";
import { UserModel } from "actions";
import { getRooms } from "actions/rooms";
import Room from "./room";

type Props = {
  navigation: Object,
};

class SelectRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getData();
    // this.props.getRooms();
  }

  getData = () => {
    firebase
      .firestore()
      .collection("docs")
      .orderBy("createtime")
      .onSnapshot(
        (snapshot) => {
          const userIdOwner = UserModel.user.id;
          const { size } = snapshot;
          let { docs } = snapshot;
          docs = docs.reverse();
          const data = [];
          let index = 0;
          docs.forEach(async (doc) => {
            const tmp = doc.data();
            if (!tmp.follow || tmp.follow[userIdOwner]) {
              // nếu ko có follow thì mở cho tất cả
              // nếu có follow thì kiểm tra xem có userId này hay ko
              const user = await UserModel.getUserById(tmp.userId);
              tmp.user = user;
              tmp["roomKey"] = doc.id; // eslint-disable-line
              data.push(tmp);
            }
            index++;
            if (index === size) {
              this.setState({ data, isLoading: false });
            }
          });
        },
        (error) => {
          console.log("home error: ", error);
        },
      );
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
          center="Danh sách"
          onRightPress={() => {
            this.props.navigation.navigate("AddRoom");
          }}
        />
        {this.state.isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="small" color={colors.default} />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Room
                navigation={this.props.navigation}
                item={item}
                onLongPress={(param) => {
                  this.param = param;
                  this.modal.open();
                }}
              />
            )}
          />
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
              this.props.navigation.navigate("ListChange", this.param);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Xem danh sách chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 15,
            }}
            onPress={() => {
              this.modal.close();
              this.props.navigation.navigate("AddRoom", this.param);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Chỉnh sửa</Text>
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
)(SelectRoom);
