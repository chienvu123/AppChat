import React, { PureComponent, ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from "react-native";
import { colors } from "themes";
import * as d from "utilities/Tranform.js";

type Props = {
  children: ReactNode,
  style: ViewStyle,
  onPress: Function,
};

const style = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    position: "absolute",
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  },
  view: {
    height: "100%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 25 * d.ratioH,
    backgroundColor: colors.placeholderColorWhite,
  },
});

export default class Modal extends PureComponent<Props> {
  static defaultProps = {
    onPress: () => {},
  };
  state = {
    isShow: false,
    animation: new Animated.Value(0),
  };
  open = () => {
    this.setState(
      {
        isShow: true,
      },
      () => {
        Animated.timing(this.state.animation, {
          duration: 120,
          toValue: 1,
        }).start();
      },
    );
  };

  close = () => {
    Animated.timing(this.state.animation, {
      duration: 120,
      toValue: 0,
    }).start(() => {
      this.setState(
        {
          isShow: false,
        },
        this.props.onPress,
      );
    });
  };

  render() {
    return this.state.isShow ? (
      <View style={style.container}>
        <TouchableOpacity
          style={style.view}
          activeOpacity={1}
          onPress={this.close}
        />
        <Animated.View
          style={[
            this.props.style,
            {
              transform: [
                {
                  translateY: this.state.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [d.height, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {this.props.children}
        </Animated.View>
      </View>
    ) : null;
  }
}
