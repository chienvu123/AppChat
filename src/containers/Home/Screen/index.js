import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import FilePickerManager from "react-native-file-picker";
import RNFS from "react-native-fs";
import { colors } from "themes";
import { Header } from "components/CustomComponent";
import Item from "../Item";
import firebase from "react-native-firebase";
// import SynchData from "../SynchData";

type Props = {
  navigation: Object,
};

class Home extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = { enableScroll: true, who: [], what: [], isSynch: false };
    this.who = {};
    this.what = {};
    this.date = new Date();
    this.roomKey = props.navigation.getParam("roomKey", "");
    this.roomId = props.navigation.getParam("roomId", "");
  }
  check = (callback = () => {}) => {
    try {
      if (Platform.OS === "android" && Platform.Version >= 23) {
        PermissionsAndroid.check(
          "android.permission.READ_EXTERNAL_STORAGE",
        ).then(
          (result) => {
            if (result) {
              callback();
            } else {
              PermissionsAndroid.requestMultiple([
                "android.permission.CAMERA",
                "android.permission.READ_EXTERNAL_STORAGE",
              ]).then(
                (result1) => {
                  if (result1) {
                    callback();
                  }
                },
                (err) => {
                  console.log("error: ", err);
                },
              );
            }
          },
          (err) => {
            console.log("error: ", err);
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  selectFile = (fileName: string) => {
    this.check(() => {
      FilePickerManager.showFilePicker(null, (response) => {
        if (response.didCancel) {
          console.log("User cancelled file picker");
        } else if (response.error) {
          console.log("FilePickerManager Error: ", response.error);
        } else if (response.path.toLocaleLowerCase().search(fileName) !== -1) {
          RNFS.readFile(response.path).then((snapshot) => {
            console.log(snapshot);
            const tmp = snapshot.split("\n");
            let next = true;
            const arr = tmp.map((item) => {
              const str = item.split("#");
              if (next) {
                if (str.length === 3) {
                  const createtime = Number(str[0]);
                  const value = str[1];
                  const endtime = Number(str[2]);
                  if (
                    typeof createtime === "number" &&
                    typeof endtime === "number"
                  ) {
                    if (fileName === "what") {
                      this.what[createtime] = value;
                      return {
                        createtime,
                        content: value,
                        endtime,
                      };
                    }
                    this.who[createtime] = value;
                    return {
                      createtime,
                      userId: value,
                      endtime,
                    };
                  }
                }

                Alert.alert("Lỗi: ", "không đúng định dạng");
                next = false;
                return null;
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
    });
  };

  editItem = (index, value) => {
    console.log(index, value);
  };
  synchData = () => {
    this.setState(
      {
        isSynch: true,
      },
      () => {
        const dataWho = this.state.who;
        const dataWhat = this.state.what;
        const { length } = dataWhat;
        let index = 0;
        dataWho.forEach((item) => {
          const tmpData = {
            ...item,
            content: dataWhat[index].content,
            status: 0, // false: chưa chỉnh sửa, true: đã chỉnh sửa
            docId: this.roomKey,
          };
          firebase
            .firestore()
            .collection("contents")
            .add(tmpData)
            .then(
              () => {
                index++;
                console.log(tmpData);
                if (index === length) {
                  this.props.navigation.goBack();
                }
              },
              (err) => {
                console.log("upload file error: ", err);
              },
            );
        });
      },
    );
  };
  render() {
    const { who, what } = this.state;

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Header
          onLeftPress={() => {
            this.props.navigation.goBack();
          }}
          center="Thêm file"
        />
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
          scrollEnabled={this.state.enableScroll}
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
                onTouchStart={() => {
                  this.setState({ enableScroll: false });
                }}
                onTouchMove={() => {
                  this.setState({ enableScroll: false });
                }}
                // onTouchEnd={() => {
                //   this.setState({ enableScroll: true });
                // }}
                // onScrollBeginDrag={() => {
                //   this.setState({ enableScroll: false });
                // }}
                onScrollEndDrag={() => {
                  this.setState({ enableScroll: true });
                }}
                renderItem={({ item }) => (
                  <Item
                    text={`${new Date(item.createtime).toLocaleString()} - ${
                      item.userId
                    }`}
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
                    text={`${new Date(item.createtime).toLocaleString()} - ${
                      item.content
                    }`}
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
                  this.synchData();
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
      </View>
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
