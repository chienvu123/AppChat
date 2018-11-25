// import { PermissionsAndroid, AsyncStorage, Platform } from "react-native";
import firebase from "react-native-firebase";
// import { User } from "constants/dataType";
import * as types from "constants/actionTypes";

export const getRooms = () => (dispatch) => {
  dispatch({ type: types.GET_ROOM_ING });
  // firebase
  //   .firestore()
  //   .collection("docs")
  //   .get()
  //   .then((snapshot) => {
  //     const data = {};
  //     snapshot.forEach((docs) => {
  //       const tmp = docs.data();
  //       data[docs.id] = tmp;
  //     });
  //     dispatch({ type: types.GET_ROOM_SUCCESS, data });
  //     console.log("data: ", data);
  //   })
  //   .catch((error) => {
  //     console.log("get rooms error: ", error);
  //     dispatch({ type: types.GET_ROOM_ERROR });
  //   });firebase
  //   .firestore()
  //   .collection("docs")
  //   .get()
  //   .then((snapshot) => {
  //     const data = {};
  //     snapshot.forEach((docs) => {
  //       const tmp = docs.data();
  //       data[docs.id] = tmp;
  //     });
  //     dispatch({ type: types.GET_ROOM_SUCCESS, data });
  //     console.log("data: ", data);
  //   })
  //   .catch((error) => {
  //     console.log("get rooms error: ", error);
  //     dispatch({ type: types.GET_ROOM_ERROR });
  //   });
  firebase
    .firestore()
    .collection("docs")
    .orderBy("createtime")
    .onSnapshot(
      (snapshot) => {
        const { docChanges } = snapshot;
        docChanges.forEach((docs) => {
          // console.log(docs.newIndex, docs.doc.data(), docs.oldIndex, docs.type);
          const { type, oldIndex, newIndex } = docs;
          const data = docs.doc.data();
          dispatch({
            type,
            data,
            oldIndex,
            newIndex,
          });
        });
        // console.log("docChange: ", snapshot.docChanges[0].doc);
      },
      (error) => {
        console.log("get rooms error: ", error);
        dispatch({ type: types.GET_ROOM_ERROR });
      },
    );
};

export const getRoomById = (roomId) => {
  console.log(roomId);
};
