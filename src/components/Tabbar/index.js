import React, { PureComponent } from "react";
import { Keyboard, Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { BottomTabBar } from "react-navigation-tabs"; // eslint-disable-line
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { colors } from "themes";
import { heightTabbar } from "utilities/Tranform";

type Props = {
  isVisible: Boolean,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    overflow: "hidden",
  },
  linearGradient: {
    height: "100%",
    width: "100%",
  },
});

class Tabbar extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      aniHeight: new Animated.Value(heightTabbar),
    };
  }
  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardWillHide,
    );
  }

  componentWillReceiveProps(nextProps) {
    const { isVisible } = nextProps;
    let height = heightTabbar;
    if (!isVisible) {
      height = 0;
    }
    this.changeStateTabbar(height);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }
  changeStateTabbar = (height: number) => {
    Animated.timing(this.state.aniHeight, {
      toValue: height,
      duration: 50,
    }).start();
  };
  keyboardWillShow = () => {
    this.changeStateTabbar(0);
  };

  keyboardWillHide = () => {
    this.changeStateTabbar(heightTabbar);
  };

  render() {
    const { style } = this.props;
    return this.props.isVisible ? (
      <Animated.View
        style={[
          styles.container,
          {
            height: this.state.aniHeight,
          },
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.2, 1]}
          colors={[colors.default, colors.defaultOpacity]}
          style={style}
        >
          <BottomTabBar {...this.props} />
        </LinearGradient>
      </Animated.View>
    ) : null;
  }
}
Tabbar.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
  style: PropTypes.any, // eslint-disable-line
  isVisible: PropTypes.bool.isRequired,
};

Tabbar.defaultProps = {
  style: styles.linearGradient,
};

const mapStateToProps = (state) => ({
  isVisible: state.tabbar.isVisible,
});

export default connect(mapStateToProps)(Tabbar);
