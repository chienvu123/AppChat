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
import { icons } from "themes";
import { UserModel } from "actions";
import { getRooms } from "actions/rooms";
import Room from "./room";

type Props = {
  navigation: Object,
};

type Param = {
  roomId: string,
};

class SelectRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    this.param = params;
    this.state = {
      data: [],
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
      .doc(this.param.roomId)
      .collection("updates")
      .orderBy("createtime")
      .onSnapshot(
        (snapshot) => {
          // console.log("home: ", snapshot.docs);
          const { size } = snapshot;
          let { docs } = snapshot;
          docs = docs.reverse();
          const data = [];
          docs.forEach(async (doc) => {
            const tmp = doc.data();
            const user = await UserModel.getUserById(tmp.userId);
            tmp.user = user;
            tmp["roomKey"] = doc.id; // eslint-disable-line
            data.push(tmp);
            if (data.length === size) {
              this.setState({ data });
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
          iconLeft={() => this.props.navigation.goBack()}
          center="Lịch sử chỉnh sửa"
        />
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Room navigation={this.props.navigation} item={item} isShow />
          )}
        />
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
