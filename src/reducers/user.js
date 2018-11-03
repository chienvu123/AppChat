import * as types from "../constants/actionTypes";

const defaultState = {
  user: {},
  userDatabase: {},
  location: {},
  isLoadingLocation: true,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.SET_USER_OWNER:
      return {
        ...state,
        user: action.user,
      };
    case types.GET_USER_ING:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload,
      };
    case types.GET_USER_FAIL:
      return {
        ...state,
        isFetching: false,
        dataSuccess: false,
        error: true,
      };
    case types.GET_POSITION_SUCCESS:
      return {
        ...state,
        isLoadingLocation: false,
        location: action.dataLocation,
      };
    case types.GET_POSITION_ERROR:
      return {
        ...state,
        isLoadingLocation: false,
        location: {},
      };
    default:
      return state;
  }
};
