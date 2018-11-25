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
    this.state = {
      data: [],
    };
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
      .onSnapshot(
        (snapshot) => {
          // console.log("home: ", snapshot.docs);
          const { docChanges } = snapshot;
          docChanges.forEach((docSnapshot) => {
            const { doc, newIndex, oldIndex, type } = docSnapshot;
            const tmp = doc.data();
            switch (type) {
              case "added":
                const { data } = this.state;
                data.push(tmp);
                this.setState({ data });
                break;
              case "modified":
                break;
              //TODO
              case "removed":
                // TODO
                break;
              default:
              // TODO
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
