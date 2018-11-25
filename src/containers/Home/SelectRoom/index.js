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
import { Header } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { icons, colors } from "themes";
import { getRooms } from "actions/rooms";

type Props = {
  getRooms: Function,
  navigation: Object,
};

class SelectRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getData();
    this.props.getRooms();
  }

  getData = () => {
    firebase
      .firestore()
      .collection("docs")
      .onSnapshot(
        (snapshot) => {
          // console.log("home: ", snapshot.docs);
          const { docs, size } = snapshot;
          const data = [];
          docs.forEach((doc) => {
            const tmp = doc.data();
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
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                width: "90%",
                height: 44,
                backgroundColor: colors.default,
                borderRadius: 5,
                justifyContent: "center",
                paddingLeft: 7,
                marginTop: 7,
                marginLeft: "5%",
              }}
              onPress={() => {
                this.props.navigation.navigate("Document", {
                  roomId: item.roomId,
                  roomKey: item.roomKey,
                });
              }}
            >
              <Text style={{ color: "white", fontSize: 15 }}>
                {`${item.roomId} - ${item.title}`}
              </Text>
            </TouchableOpacity>
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
