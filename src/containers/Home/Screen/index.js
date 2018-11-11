import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import FilePickerManager from "react-native-file-picker";
import RNFS from "react-native-fs";
import { colors } from "themes";
import Item from "../Item";
// import SynchData from "../SynchData";

type Props = {
  navigation: Object,
};

class Home extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.who = {};
    this.what = {};
    this.date = new Date();
  }

  componentDidMount() {
    this.props.navigation.setParams({ scrollToTop: this.handleBackPress });
  }
  handleBackPress = () => {
    if (this.offset > 20) {
      this.scrollView.scrollTo({ y: 0, x: 0, animated: true });
      return true;
    }
    return false;
  };
  selectFile = (fileName: string) => {
    FilePickerManager.showFilePicker(null, (response) => {
      if (response.didCancel) {
        console.log("User cancelled file picker");
      } else if (response.error) {
        console.log("FilePickerManager Error: ", response.error);
      } else if (response.path.toLocaleLowerCase().search(fileName) !== -1) {
        RNFS.readFile(response.path).then((snapshot) => {
          console.log(snapshot);
          const tmp = snapshot.split("\n");
          const arr = tmp.map((item) => {
            const index = item.search(/ /);
            if (index !== -1) {
              const createtime = item.substr(0, index);
              const value = item.substr(index + 1, item.length - index);
              if (fileName === "what") {
                this.what[createtime] = value;
                return {
                  createtime,
                  content: value,
                };
              }
              this.who[createtime] = value;
              return {
                createtime,
                userName: value,
              };
            }
            return null;
          });
          if (fileName === "who") {
            this.setState({
              who: arr,
            });
          } else {
            this.setState({
              what: arr,
            });
          }
        });
      } else {
        Alert.alert("Lưu ý: ", "Bạn chọn sai file rồi", [
          {
            text: "Đồng ý",
            onPress: () => this.selectFile(fileName),
          },
        ]);
      }
    });
  };

  editItem = (index, value) => {
    console.log(index, value);
  };

  render() {
    const { who, what } = this.state;
    return (
      <ScrollView
        ref={(node) => {
          this.scrollView = node;
        }}
        style={{
          flex: 1,
        }}
        onScroll={(e) => {
          this.offset = e.nativeEvent.contentOffset.y;
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => {
            this.selectFile("who");
          }}
          style={{
            height: 40,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.default,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.white }}>
            File Who
          </Text>
        </TouchableOpacity>
        <View style={{ width: "100%", height: 350 }}>
          {who ? (
            <FlatList
              data={who}
              renderItem={({ item }) => (
                <Item
                  text={`${this.date
                    .setTime(item.createtime)
                    .toLocaleString()} - ${item.userName}`}
                  bgColor={colors.defaultOpacity}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            this.selectFile("what");
          }}
          style={{
            height: 40,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.default,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.white }}>
            File What
          </Text>
        </TouchableOpacity>
        <View style={{ width: "100%", height: 350 }}>
          {what ? (
            <FlatList
              style={{ width: "100%", height: 400 }}
              data={what}
              renderItem={({ item }) => (
                <Item
                  text={`${this.date
                    .setTime(item.createtime)
                    .toLocaleString()} - ${item.content}`}
                  bgColor={colors.defaultOpacity}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : null}
        </View>
        <View
          style={{
            width: "100%",
            height: 40,
            alignItems: "center",
            marginBottom: 70,
          }}
        >
          <TouchableOpacity
            style={{
              width: "70%",
              height: "100%",
              borderRadius: 3,
              backgroundColor: colors.orange,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              if (who && what && who.length === what.length) {
                this.props.navigation.navigate("SynchData", {
                  dataWho: who,
                  dataWhat: what,
                  onEditItem: this.editItem,
                });
              } else {
                Alert.alert("Nhắc nhở:", "Không đủ data");
              }
            }}
          >
            <Text style={{ fontWeight: "bold", color: colors.white }}>
              Đồng bộ
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ flex: 1 }}>
          <SynchData dataWho={who} dataWhat={what} />
        </View> */}
      </ScrollView>
    );
  }
}

export default Home;
/*
<ScrollView
          style={{
            flex: 1,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              {who ? (
                <FlatList
                  data={who}
                  renderItem={({ item }) => (
                    <Item
                      text={`${this.date
                        .setTime(item.createtime)
                        .toLocaleString()} - ${item.userName}`}
                      bgColor={colors.default}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              {what ? (
                <FlatList
                  data={what}
                  renderItem={({ item }) => (
                    <Item
                      text={`${this.date
                        .setTime(item.createtime)
                        .toLocaleString()} - ${item.content}`}
                      bgColor={colors.defaultOpacity}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
*/
