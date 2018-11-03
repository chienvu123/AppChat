import { StyleSheet } from "react-native";
import { colors } from "themes";
import * as d from "utilities/Tranform";

const signup = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 173,
  },
  input: {
    marginBottom: 20 * d.ratioH,
  },
  form: {
    flex: 2.5,
    alignItems: "center",
    paddingTop: 86 * d.ratioH,
  },
  btn: {
    width: 260 * d.ratioW,
    height: 40 * d.ratioH,
    marginBottom: 17 * d.ratioH,
    marginTop: 40 * d.ratioH,
    elevation: 3,
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
  vBottom: {
    width: "100%",
    marginTop: 63 * d.ratioH,
    alignItems: "center",
    marginBottom: 7 * d.ratioH,
  },
  txtBottom: {
    fontSize: 10,
    opacity: 0.65,
    color: colors.white,
  },
  txtBtn: {
    color: "#2AB9B9",
    fontWeight: "600",
    fontSize: 17,
  },
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

export default signup;
