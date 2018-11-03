import { Dimensions } from "react-native";
/* eslint-disable */
const IPHONE_8_DEVICE_WIDTH = 414;

export default class Scale {
  static getSize(size) {
    if (typeof size !== "number") {
      throw new Error("Error: Scale.getSize can't parse a non number value");
    }

    return (size * Dimensions.get("window").width) / IPHONE_8_DEVICE_WIDTH;
  }

  static getFontWeight(fontWeight) {
    if (typeof fontWeight !== "string") {
      throw new Error(
        "Error: Scale.getFontWeight can't parse a non string value",
      );
    }

    const fontWeightParsedValue = parseInt(fontWeight, 10);
    if (Number.isNaN(fontWeightParsedValue)) {
      throw new Error(
        "Error: Scale.getFontWeight can't parse this fontWeight value - 1",
      );
    }

    if (fontWeightParsedValue % 100 !== 0) {
      throw new Error(
        "Error: Scale.getFontWeight can't parse this fontWeight value - 2",
      );
    }
    return `${Math.round(
      (fontWeightParsedValue * Dimensions.get("window").width) /
        IPHONE_8_DEVICE_WIDTH /
        100,
    ) * 100}`;
  }
}
