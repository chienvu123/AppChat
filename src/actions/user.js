import { PermissionsAndroid, AsyncStorage, Platform } from "react-native";
import firebase from "react-native-firebase";
import { User } from "constants/dataType";
import * as types from "constants/actionTypes";

// const getUser = () => ({
//   type: types.GET_USER_ING,
// });
// const getUserSuccess = (data) => ({
//   type: types.GET_USER_SUCCESS,
//   payload: data,
// });
// const getUserFail = () => ({
//   type: types.GET_USER_FAIL,
// });

/* eslint-disable */
class Instance {
  arrUser: User[] = [];
  setUser = (
    user: Object,
    token: string = null,
    account: {
      account: string,
      password: string,
    } = null,
  ) => (dispatch) => {
    const lastLogin = new Date().getTime();
    const status = {
      active: true,
      enable: true,
      lastLogin,
    };
    try {
      console.log("user: ", user);
      if (token) {
        AsyncStorage.setItem("tokenLogin", token);
      }
      AsyncStorage.setItem("userId", user.id);
      dispatch({
        type: types.SET_USER_OWNER,
        user,
      });
      const refAccount = firebase
        .firestore()
        .collection("account")
        .doc(user.id);
      const refUser = firebase
        .firestore()
        .collection("users")
        .doc(user.id);
      if (!account) {
        refAccount.update({ status });

        // refUser.update({ ...user, status });
      } else {
        refAccount.set({
          account: account.account,
          password: account.password,
          status,
        });
        refUser.set(user);
      }
    } catch (error) {
      console.log("set user error:", error);
    }
  };

  getUserById = async (userId: string): User => {
    try {
      let user: User = this.arrUser[userId];
      if (!user) {
        const child = firebase
          .firestore()
          .collection("users")
          .doc(userId);
        const value = await child.get();
        user = value.data();
        // const snapshot = await child.once("value");
        // user = snapshot.val();
        this.arrUser[userId] = user;
      }
      return user;
    } catch (error) {
      console.log("getUser error: ", error);
      return null;
    }
  };
  logIn = async (
    input: {
      phoneNumber: string,
      password: string,
    },
    success = (user: User, tokenId: string) => {},
    errorCallback = (error) => {},
  ) => {
    firebase
      .auth()
      .signInAndRetrieveDataWithEmailAndPassword(
        `${input.phoneNumber}@gmail.com`,
        input.password,
      )
      .then(async (snapshot) => {
        try {
          const userId = snapshot.user.uid;
          const tokenId = await snapshot.user.getIdToken();
          const user = await this.getUserById(userId);
          success(user, tokenId);
        } catch (error) {
          console.log("login error: ", error);
          errorCallback(error);
        }
      })
      .catch((error) => {
        console.log("login error");
        errorCallback(error);
      });
  };
  getPositionUser = () => (dispatch) => {
    // eslint-disable-next-line
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;
        dispatch({
          type: types.GET_POSITION_SUCCESS,
          dataLocation: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
      },
      () => {
        PermissionsAndroid.PERMISSIONS;

        try {
          if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(
              (result) => {
                if (result) {
                  this.getPositionUser();
                } else {
                  PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  ).then(
                    (result1) => {
                      if (result1) {
                        this.getPositionUser();
                      } else {
                        dispatch({
                          type: types.GET_POSITION_ERROR,
                        });
                      }
                    },
                    (err) => {
                      dispatch({
                        type: types.GET_POSITION_ERROR,
                      });
                    },
                  );
                }
              },
              (err) => {
                error(2, err);
              },
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  };
}

class UserModel {
  instance: Instance;
  static getInstance(): Instance {
    if (!this.instance) {
      this.instance = new Instance();
    }
    return this.instance;
  }
}

export default UserModel.getInstance();
