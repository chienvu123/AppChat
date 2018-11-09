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
import SynchData from "../SynchData";

class Home extends PureComponent<> {
  constructor(props) {
    super(props);
    this.state = {};
    this.who = {};
    this.what = {};
  }

  componentDidMount() {}
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

  render() {
    const { who, what } = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 40,
              borderBottomColor: colors.searchType2,
              borderBottomWidth: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.selectFile("who");
              }}
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.default,
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.white }}>
                File Who
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.selectFile("what");
              }}
              style={{
                flex: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.default,
              }}
            >
              <Text style={{ fontWeight: "bold", color: colors.white }}>
                File What
              </Text>
            </TouchableOpacity>
          </View>

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
                        text={`${item.createtime} - ${item.userName}`}
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
                        text={`${item.createtime} - ${item.content}`}
                        bgColor={colors.defaultOpacity}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <SynchData dataWho={who} dataWhat={what} />
        </View>
      </View>
    );
  }
}

export default Home;
