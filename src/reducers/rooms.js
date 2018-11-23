import * as types from "../constants/actionTypes";

const defaultState = {
  data: [],
  isGetting: true,
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case types.ADD_ROOM:
      return {
        ...state,
        data: [...state.data, action.data],
      };
    case types.UPDATE_ROOM:
      return {
        ...state,
        data: [...state.data, action.data],
      };
    case types.DELETE_ROOM:
      // TODO
      return {};
    case types.GET_POSITION_ERROR:
      return {
        ...state,
        isGetting: false,
      };
    default:
      // TODO
      return state;
  }
};
