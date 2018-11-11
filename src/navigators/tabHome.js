/**
 * @flow
 */
import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { createBottomTabNavigator, TabNavigator } from "react-navigation";
import TabbarCustom from "components/Tabbar";
import { colors, icons } from "../themes";
import HomeStack from "../containers/Home";
import Setting from "../containers/Setting";
import { horizontalScale, verticalScale } from "../utilities/Tranform";

const navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  try {
    const { index } = navigation.state;
    if (index === 0) {
      tabBarVisible = true;
    } else {
      tabBarVisible = false;
    }
  } catch (err) {
    console.log("err at nav Option HomeNavigator", err);
  }
  return {
    tabBarVisible,
  };
};

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions,
    },
    Setting: {
      screen: Setting,
      navigationOptions,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let icon;
        switch (routeName) {
          case "Home":
            icon = icons.home;
            break;
          case "Setting":
            icon = icons.setting;
            break;
          default:
        }
        const iconBG = (
          <View
            style={{
              flex: 1,
              justifyContent: focused ? "flex-end" : "center",
            }}
          >
            <ImageBackground
              source={icon}
              style={{
                width: focused ? 18 : 25,
                height: focused ? 18 : 25,
              }}
              resizeMethod="resize"
              resizeMode="contain"
            />
          </View>
        );
        return iconBG;
      },
      // eslint-disable-next-line
      tabBarLabel: ({ focused }) => {
        const { routeName } = navigation.state;
        const style = {
          color: colors.white,
          textAlign: "center",
          lineHeight: verticalScale(22),
          fontSize: horizontalScale(11),
        };
        console.log(routeName, focused);
        if (routeName === "Home") {
          if (focused) {
            return <Text style={style}>Trang chủ</Text>;
          }
          return null;
        }
        if (routeName === "Event") {
          if (focused) {
            return <Text style={style}>Kết nối</Text>;
          }
          return null;
        }
        if (routeName === "Medical") {
          if (focused) {
            return <Text style={style}>Sổ y tế</Text>;
          }
          return null;
        }
        if (routeName === "Setting") {
          if (focused) {
            return <Text style={style}>Cài đặt</Text>;
          }
          return null;
        } else if (routeName === "Map") {
          if (focused) {
            return <Text style={style}>Tìm kiếm</Text>;
          }
          return null;
        }
      },
    }),
    animationEnabled: true,
    initialRouteName: "Home",
    tabBarComponent: (props) => <TabbarCustom {...props} />, // eslint-disable-line
    tabBarOptions: {
      ...TabNavigator.Presets.iOSBottomTabs,
      scrollEnabled: true,
      style: {
        backgroundColor: "transparent",
        // borderTopWidth: 0,
        // height: verticalScale(48),
        // position: "absolute",
        // left: 0,
        // right: 0,
        // bottom: 0,
      },
      // tabStyle: {
      //   backgroundColor: "transparent",
      //   alignItems: "center",
      // },
    },
  },
);
