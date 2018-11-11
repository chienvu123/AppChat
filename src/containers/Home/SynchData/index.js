import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { colors, icons } from "themes";
import { Header } from "components/CustomComponent";
import Item from "../Item";

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

class SynchData extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const synchData = [];
    this.state = {
      synchData,
      arrEdited: [],
    };
    this.date = new Date();
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
    this.setState({
      synchData: arr,
    });
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
            this.props.navigation.navigate("Template", { SynchData })
          }
        />
        <View style={{ width: "100%", minHeight: 200, maxHeight: 400 }}>
          <FlatList
            style={{ flex: 1 }}
            data={synchData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Item
                text={`${this.date
                  .setTime(item.createtime)
                  .toLocaleString()} - ${item.userName} - ${item.content}`}
                bgColor={colors.synch}
                onSubmit={(value) => {
                  this.edit(index, value);
                }}
                enableEditing
              />
            )}
          />
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
          >
            <Text style={{ fontWeight: "bold", color: colors.white }}>
              Đồng bộ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default SynchData;
