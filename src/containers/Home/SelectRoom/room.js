import React, { PureComponent } from "react";
import { TouchableOpacity, Text } from "react-native";
import colors, { renderColor } from "themes/Colors";

type Props = {
  navigation: Object,
  item: Object,
  onLongPress: Function,
  isShow?: boolean,
};

export default class Room extends PureComponent<Props> {
  static defaultProps = {
    onLongPress: () => {},
    isShow: false,
  };
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, navigation, onLongPress, isShow } = this.props;
    const param = {
      roomId: item.roomId,
      roomKey: item.roomKey,
    };
    return (
      <TouchableOpacity
        style={{
          width: "90%",
          height: 44,
          backgroundColor: isShow ? colors.default : renderColor(item.status),
          borderRadius: 5,
          justifyContent: "center",
          paddingLeft: 7,
          marginTop: 7,
          marginLeft: "5%",
        }}
        onPress={
          !isShow
            ? () => {
                navigation.navigate("Document", param);
              }
            : () => {}
        }
        onLongPress={() => {
          onLongPress({
            ...param,
            isUpdate: true,
            item,
          });
        }}
      >
        <Text style={{ color: "white", fontSize: 15 }}>
          {`${item.roomId} - ${
            item.status !== -1 ? item.title : "Đang khởi tạo"
          }`}
        </Text>
      </TouchableOpacity>
    );
  }
}
