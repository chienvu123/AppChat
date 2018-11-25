import { Dimensions } from "react-native";

const base = {
  width: 360,
  height: 640,
};
const { width, height } = Dimensions.get("window");
const ratioH = height / base.height;
const ratioW = width / base.width;

const horizontalScale = (size: number, factor: number = 1): number =>
  size + (ratioW * size - size) * factor; // eslint-disable-line
const verticalScale = (size: number, factor: number = 1): number =>
  size + (ratioH * size - size) * factor; // eslint-disable-line
const header = verticalScale(56);
const heightTabbar = verticalScale(50);
export {
  width,
  height,
  ratioH,
  ratioW,
  horizontalScale,
  verticalScale,
  header,
  heightTabbar,
};
