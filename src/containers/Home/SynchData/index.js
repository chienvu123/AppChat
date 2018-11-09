import React, { PureComponent } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { colors } from "themes";
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
};

class SynchData extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const synchData = [];
    this.state = {
      synchData,
    };
  }

  synchData = () => {
    const { dataWho, dataWhat } = this.props;
    if (dataWho && dataWhat) {
      const arr = dataWho.map((item, index) => ({
        ...item,
        content: dataWhat[index].content,
        status: false, // false: chưa chỉnh sửa, true: đã chỉnh sửa
      }));
      this.setState({
        synchData: arr,
      });
    } else {
      Alert.alert("Nhắc nhở:", "Không đủ data");
    }
  };

  edit = (index) => {
    const { synchData } = this.state;
    const item = synchData[index];
    item.status = !item.status;
    synchData[index] = item;
    this.setState({ synchData });
  };

  render() {
    const { synchData } = this.state;
    console.log("SynchData: ", this.state.synchData);
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <FlatList
          style={{ flex: 1 }}
          data={synchData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Item
              text={`${item.createtime} - ${item.userName} - ${item.content}`}
              bgColor={colors.synch}
              onLongPress={() => {
                this.edit(index);
              }}
              enableEditing
            />
          )}
        />
      </View>
    );
  }
}
export default SynchData;
