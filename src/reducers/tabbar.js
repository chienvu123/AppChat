import * as types from "../constants/actionTypes";

const defaultState = {
  isVisible: true,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.TABBAR_VISIBLE:
      return {
        ...state,
        isVisible: true,
      };
    case types.TABBAR_HIDDEN:
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};
