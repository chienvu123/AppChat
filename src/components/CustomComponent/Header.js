import React, { PureComponent, ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors, icons } from "themes";
import { verticalScale, horizontalScale, header } from "utilities/Tranform";

type Props = {
  onLeftPress: Function,
  iconLeft: ReactNode,
  onRightPress: Function,
  iconRight: ReactNode,
  center: ReactNode,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: header,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: verticalScale(15),
    elevation: 3,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  left: {
    width: "20%",
    alignItems: "center",
    paddingVertical: verticalScale(3),
  },
  center: {
    width: "60%",
    alignItems: "center",
  },
  right: {
    width: "20%",
    alignItems: "center",
    paddingVertical: verticalScale(3),
  },
  iconBack: {
    width: verticalScale(20),
    height: verticalScale(20),
  },
  view: {
    width: "100%",
    zIndex: 50,
    elevation: 20,
    height: header,
  },
});

const MAX_LEFT = horizontalScale(370);

export default class Index extends PureComponent<Props> {
  static defaultProps = {
    styleContainer: styles.container,
    iconLeft: (
      <ImageBackground source={icons.backWhite} style={styles.iconBack} />
    ),
  };
  state = {
    aniMarginLeft: new Animated.Value(MAX_LEFT),
  };
  componentDidMount() {
    Animated.timing(this.state.aniMarginLeft, {
      toValue: 0,
      duration: 50,
    }).start();
  }
  componentWillUnmount() {
    Animated.timing(this.state.aniMarginLeft, {
      toValue: MAX_LEFT,
      duration: 50,
    }).start();
  }

  render() {
    const {
      onLeftPress,
      iconLeft,
      iconRight,
      onRightPress,
      center,
    } = this.props;
    const { aniMarginLeft } = this.state;
    return (
      <Animated.View
        style={[styles.view, { transform: [{ translateX: aniMarginLeft }] }]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.2, 1]}
          colors={[colors.default, colors.defaultOpacity]}
          style={styles.container}
        >
          {/* <View style={styles.container}> */}
          <TouchableOpacity onPress={onLeftPress} style={styles.left}>
            {iconLeft}
          </TouchableOpacity>
          <View style={styles.center}>{center}</View>
          <TouchableOpacity onPress={onRightPress} style={styles.right}>
            {iconRight}
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      </Animated.View>
    );
  }
}
