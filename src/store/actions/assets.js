import { ADD_ASSETS_TO_LIST } from "../types/assets";

export const addAssetsToList = assets => ({
  type: ADD_ASSETS_TO_LIST,
  payload: assets
});
