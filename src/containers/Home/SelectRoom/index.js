/**
 * @flow
 */
import React, { PureComponent } from "react";
import { View, ImageBackground, StatusBar } from "react-native";
import { Header } from "components/CustomComponent";
import { connect } from "react-redux";
import firebase from "react-native-firebase";
import { icons } from "themes";
import { getRooms } from "actions/rooms";

type Props = {
  getRooms: Function,
  data: Object,
};

class SelectRoom extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getData();
    this.props.getRooms();
  }
  componentWillReceiveProps(nextProps: Props) {
    console.log("receive rooms data: ", nextProps.data);
  }
  getData = () => {
    firebase
      .firestore()
      .collection("docs")
      .get()
      .then((snapshot) => {
        // console.log("home: ", snapshot.docs);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <Header
          iconLeft={null}
          iconRight={
            <ImageBackground
              source={icons.add}
              style={{ width: 30, height: 30 }}
            />
          }
          center="Văn bản"
          onRightPress={() => {
            console.log("click add");
          }}
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
