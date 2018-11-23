import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { Header } from "components/CustomComponent";
import Pdf from "react-native-pdf";
import template from "../../pdf";

type Props = {
  navigation: Object,
};

class Template extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = props.navigation.getParam("data", []);
  }
  componentDidMount() {}
  render() {
    // const resourceType = "url";
    // const source =
    //   "https://drive.google.com/open?id=17LjUxFd5Z1nA96hFj2-cfES_GyexCKNS";
    const key = Object.keys(template);
    return (
      <ScrollView style={{ flex: 1 }}>
        <Header
          onLeftPress={() => this.props.navigation.goBack()}
          center="Mẫu in"
        />
        <FlatList
          data={key}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                height: 200,
                width: "100%",
                overflow: "hidden",
              }}
              onPress={() =>
                this.props.navigation.navigate("ShowTemplate", {
                  source: item,
                  data: this.data,
                })
              }
            >
              <View style={{ height: 500, width: "100%" }}>
                <Pdf
                  style={{ width: "100%", height: "100%" }}
                  // source={{ uri: source }}
                  source={template[item]}
                  onLoadProgress={(number) => console.log(number)}
                  onError={(error) => {
                    console.log("load error: ", error);
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    );
  }
}

export default connect()(Template);
