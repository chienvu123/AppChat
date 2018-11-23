import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import { colors, icons } from "themes";
import { Header } from "components/CustomComponent";
import Item from "../Item";
import { verticalScale } from "utilities/Tranform";

type Props = {
  dataWho: {
    createtime: number,
    userName: string,
  },
  dataWhat: {
    createtime: number,
    content: string,
  },
  navigation: Object,
};
const MIN_HEIGHT = verticalScale(200);
const HEIGHT_ITEM = verticalScale(15);
class SynchData extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const synchData = [];
    this.state = {
      synchData,
      arrEdited: [],
    };
    this.aniHeight = new Animated.Value(MIN_HEIGHT);
  }

  componentDidMount() {
    this.synchData();
  }

  synchData = () => {
    const dataWho = this.props.navigation.getParam("dataWho", []);
    const dataWhat = this.props.navigation.getParam("dataWhat", []);
    const arr = dataWho.map((item, index) => ({
      ...item,
      content: dataWhat[index].content,
      isEdit: false, // false: chưa chỉnh sửa, true: đã chỉnh sửa
    }));
    this.setState(
      {
        synchData: arr,
      },
      () => {
        Animated.timing(this.aniHeight, {
          duration: 50,
          toValue: MIN_HEIGHT + arr.length * HEIGHT_ITEM,
        }).start();
      },
    );
  };

  edit = (index, value) => {
    const { synchData, arrEdited } = this.state;
    const item = synchData[index];
    item.isEdit = !item.isEdit;
    item.content = value;
    arrEdited[index] = item;
    this.setState({ arrEdited });
  };

  render() {
    const { synchData } = this.state;
    console.log("SynchData: ", this.state.synchData);
    return (
      <View style={{ flex: 1 }}>
        {/* <TouchableOpacity
          style={{
            width: "100%",
            height: 40,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={this.synchData}
        >
          <Text>Đồng bộ</Text>
        </TouchableOpacity> */}
        <Header
          onLeftPress={() => {
            this.props.navigation.goBack();
          }}
          center="Đồng bộ"
          iconRight={
            <ImageBackground
              source={icons.save}
              style={{ width: 20, height: 20 }}
              resizeMethod="resize"
              resizeMode="contain"
            />
          }
          onRightPress={() =>
            this.props.navigation.navigate("Template", { data: synchData })
          }
        />
        <Animated.View style={{ width: "100%", height: this.aniHeight }}>
          <FlatList
            style={{ flex: 1 }}
            data={synchData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Item
                text={`${new Date(item.createtime).toLocaleString()} - ${
                  item.userName
                } - ${item.content}`}
                bgColor={colors.synch}
                onSubmit={(value) => {
                  this.edit(index, value);
                }}
                enableEditing
              />
            )}
          />
        </Animated.View>
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
              marginTop: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", color: colors.white }}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default SynchData;
