import { StyleSheet } from "react-native";
import { colors } from "themes";
import * as d from "utilities/Tranform";

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  logo: {
    width: d.verticalScale(90),
    height: d.verticalScale(90),
  },
  vTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vBottom: {
    alignItems: "center",
    height: 200 * d.ratioH,
    width: "100%",
  },
  btn: {
    width: 260 * d.ratioW,
    height: 40 * d.ratioH,
    marginBottom: 17 * d.ratioH,
    elevation: 6,
    backgroundColor: colors.white,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  txt: {
    fontSize: 15,
    color: colors.white,
    fontWeight: "600",
    padding: 0,
  },
});

export default style;
