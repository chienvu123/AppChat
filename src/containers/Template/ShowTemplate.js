import React, { PureComponent } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from "react-native";
import Pdf from "react-native-pdf";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { Modal, Header } from "components/CustomComponent";
import style from "./style";
import * as template from "../../template";

type Props = {
  source: any, // eslint-disable-line
  navigation: Object,
};
const END = `  </table>
</div>
</body>`;
const checkPermission = (callback = () => {}) => {
  if (Platform.OS === "android" && Platform.Version >= 23) {
    PermissionsAndroid.check("android.permission.READ_EXTERNAL_STORAGE").then(
      (result) => {
        if (result) {
          callback();
        } else {
          PermissionsAndroid.requestMultiple([
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
          ]).then(
            (result1) => {
              switch (result1["android.permission.WRITE_EXTERNAL_STORAGE"]) {
                case PermissionsAndroid.RESULTS.GRANTED:
                  callback();
                  break;

                case PermissionsAndroid.RESULTS.DENIED:
                  checkPermission(callback);
                  break;

                case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
                  Alert.alert(
                    "Xuất file báo cáo không thành công",
                    'Vui cấp quyền truy cập để có ứng dụng có thể hoạt động. Vào "Cài đặt" của điện thoại để thực hiện', // eslint-disable-line
                    [{ text: "Đã hiểu" }],
                  );
                  break;

                default:
                  break;
              }
            },
            (err) => {
              ToastAndroid.show(
                "Xuất file báo cáo không thành công",
                ToastAndroid.SHORT,
              );
              console.log("error: ", err);
            },
          );
        }
      },
      (err) => {
        ToastAndroid.show(
          "Xuất file báo cáo không thành công",
          ToastAndroid.SHORT,
        );
        console.log("error1: ", err);
      },
    );
  } else {
    callback();
  }
};
export default class ShowTemplate extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    const source = props.navigation.getParam("source", null);
    const data = props.navigation.getParam("data", []);
    this.data = data;
    this.source = source;
  }

  componentDidMount() {
    checkPermission(() => {
      this.modal.open();
    });
  }

  export = async () => {
    const { fileName } = this;
    if (fileName) {
      this.modal.close();
      let str = template[this.source];
      if (this.source === "template1") {
        this.data.forEach((item) => {
          const item1 = `<tr>
                    <td class="time">${new Date(
                      item.createtime,
                    ).toLocaleString()}</td>
                    <td class="name">${item.user.name}</td>
                    <td class="content">${item.content}</td>
                  </tr>`;
          str += item1;
        });
      } else {
        /* eslint-disable */
        this.data.forEach((item) => {
          const item2 = `<tr>
                    <td class="date">${new Date(
                      item.createtime,
                    ).toLocaleDateString()}</td>
                    <td class="time">${new Date(
                      item.createtime,
                    ).toLocaleTimeString()}</td>
                    <td class="name">${item.user.name}</td>
                    <td class="content">${item.content}</td>
                  </tr>`;
          str += item2;
        });
      }
      str += END;
      console.log(str);
      /* eslint-enable */
      const options = {
        fileName,
        directory: "docs",
        html: str,
      };
      const filePath = await RNHTMLtoPDF.convert(options);
      console.log(filePath);
      Alert.alert(
        "Thông báo:",
        "Xuất file thành công, bạn có muốn chia sẻ không?",
        [
          {
            text: "Có",
            onPress: () => {},
          },
          {
            text: "Không",
            onPress: () => {
              this.props.navigation.goBack();
            },
          },
        ],
      );
    } else {
      this.setState({ message: "Bạn không được để trống tên file" });
    }
  };

  render() {
    const { message } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          onLeftPress={() => {
            this.props.navigation.goBack();
          }}
          center="Kết quả"
        />
        <Modal
          ref={(modal) => {
            this.modal = modal;
          }}
          style={style.modal}
        >
          <Text style={style.txtModal}>
            Hãy điền tên báo cáo vào ô bên dưới
          </Text>
          <TextInput
            placeholder="Nhập tên vào đây ..."
            style={style.inputModal}
            underlineColorAndroid="transparent"
            defaultValue={this.codeInput}
            onChangeText={(text) => {
              this.fileName = text;
            }}
            onFocus={() => {
              this.fileName = "";
            }}
            onSubmitEditing={this.export}
          />
          {message ? (
            <Text style={[style.txtModal, { color: "red" }]}>{message}</Text>
          ) : null}
          <TouchableOpacity style={style.btnModal} onPress={this.export}>
            <Text style={style.txtBtnModal}>Tiếp tục</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
