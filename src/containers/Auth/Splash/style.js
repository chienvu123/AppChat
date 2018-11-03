import { StyleSheet } from "react-native";
import * as d from "utilities/Tranform";

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: d.verticalScale(90),
    height: d.verticalScale(90),
  },
});

export default style;
