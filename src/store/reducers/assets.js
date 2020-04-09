import { ADD_ASSETS_TO_LIST } from "../types/assets";

const initialState = [];

export const assetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ASSETS_TO_LIST: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};
