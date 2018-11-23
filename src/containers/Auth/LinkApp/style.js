import { StyleSheet } from "react-native";
import { colors } from "themes";
import * as d from "utilities/Tranform";

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnModal: {
    backgroundColor: "#FF9057",
    height: 36 * d.ratioH,
    width: "80%",
    borderRadius: 18 * d.ratioH,
    marginTop: 13 * d.ratioH,
    marginBottom: 21 * d.ratioH,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtnModal: {
    fontWeight: "600",
    fontSize: 17,
    color: colors.white,
    fontFamily: "Helvetica Neue, Medium",
  },
  txtModal: {
    marginTop: 16 * d.ratioH,
    textAlign: "center",
    fontSize: 15,
    width: 210 * d.ratioW,
    color: "#2A2E43",
    letterSpacing: 1,
  },
});

export default style;
