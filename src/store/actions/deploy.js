import { message } from "antd";

import {
  PENDING_DEPLOY_REQUEST,
  REQUEST_DEPLOY,
  CANCEL_PENDING_DEPLOY_REQUEST,
  RESPONSE_PENDING_DEPLOY,
  ADD_TO_TOKEN_REGISTRY_SWITCH,
  CHECK_TOKEN_PENDING,
  CHECK_TOKEN,
  CHECK_TOKEN_CLEAR,
  ADD_TO_TOKEN_REGISTRY_CLOSE
} from "../types/deploy";

import history from "../../history";
import client from "../../socket";
import { redirect } from "../../utils";
import config from "../../config";

export const pendingDeployRequest = (params, url) => async (
  dispatch,
  getState
) => {
  const store = getState();
  const pending = store.deploy.pending;

  let data_feed;
  let data_feed_ma;
  try {
    data_feed = await client.api.getDataFeed({
      oracles: [params.oracle],
      feed_name: params.feed_name,
      ifnone: "none"
    });
    data_feed_ma = await client.api.getDataFeed({
      oracles: [params.oracle],
      feed_name: params.ma_feed_name,
      ifnone: "none"
    });
  } catch (e) {
    console.log("error getDataFeed", e);
  }
  if (!pending) {
    if (
      data_feed &&
      data_feed !== "none" &&
      data_feed_ma &&
      data_feed_ma !== "none"
    ) {
      redirect(url);
      dispatch({
        type: PENDING_DEPLOY_REQUEST,
        payload: params
      });
    } else {
      message.error("Data feeds is undefined");
    }
  }
};
export const deployRequest = address => async (dispatch, getState) => {
  const store = getState();
  const pending = store.deploy.pending;
  if (pending) {
    await dispatch({
      type: REQUEST_DEPLOY,
      payload: address
    });
  }
  history.push("/app");
};

export const cancelPendingDeployRequest = () => ({
  type: CANCEL_PENDING_DEPLOY_REQUEST
});

export const pendingDeployResponse = () => ({
  type: RESPONSE_PENDING_DEPLOY
});

export const clearCheckToken = () => ({
  type: CHECK_TOKEN_CLEAR
});

export const pendingCheckToken = symbol => async dispatch => {
  await dispatch({
    type: CHECK_TOKEN_PENDING
  });
  await dispatch(checkToken(symbol));
};

export const checkToken = symbol => async (dispatch, getState) => {
  const store = getState();
  const pending = store.deploy.checkTokenPending;
  if (pending) {
    const asset = await client.api.getAssetBySymbol(
      config.TOKEN_REGISTRY_AA_ADDRESS,
      symbol
    );
    await dispatch({
      type: CHECK_TOKEN,
      payload: !!asset
    });
  }
};

export const tokenRegistrySwitch = value => ({
  type: ADD_TO_TOKEN_REGISTRY_SWITCH,
  payload: value
});
export const tokenRegistryClose = () => ({
  type: ADD_TO_TOKEN_REGISTRY_CLOSE
});
