import { StyleSheet } from "react-native";
import { colors } from "themes";
import * as d from "utilities/Tranform";

const style = StyleSheet.create({
  modal: {
    width: "90%",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 35 * d.ratioW,
    elevation: 6,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 35 * d.ratioW,
  },
  inputModal: {
    borderWidth: 1,
    borderColor: "#707070",
    borderRadius: 17 * d.ratioH,
    height: 34 * d.ratioH,
    marginTop: 7 * d.ratioH,
    width: "100%",
    padding: 0,
    paddingLeft: 10 * d.ratioW,
  },
  btnModal: {
    backgroundColor: "#FF9057",
    height: 34 * d.ratioH,
    width: 210 * d.ratioW,
    borderRadius: 17 * d.ratioH,
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
    width: "100%",
    color: "#2A2E43",
    letterSpacing: 1,
  },
});

export default style;
