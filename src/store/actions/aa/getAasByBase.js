import { LOAD_AA_LIST_REQUEST, LOAD_AA_LIST_SUCCESS } from "../../types/aa";
import client from "../../../socket";
import config from "../../../config";
import moment from "moment";
import { addAssetsToList } from "../assets";
import { addSymbolsToList } from "../symbols";

export const getAasByBase = () => async (dispatch, getState) => {
  const today = moment().format("YYYY-MM-DD");
  const store = getState();
  try {
    await dispatch({
      type: LOAD_AA_LIST_REQUEST
    });
    const aaByBase = await client.api.getAasByBaseAas({
      base_aa: config.BASE_AA
    });
    const { assets } = store;

    const getExtendAssets = aaByBase.map(async aa => {
      const found = aa.address in assets;
      if (!found) {
        return client.api
          .getAaStateVars({
            address: aa.address,
            var_prefix: "asset"
          })
          .then(data => {
            if ("asset" in data) {
              return { address: aa.address, ...data };
            }
          });
      }
    });

    const extendAssets = await Promise.all(getExtendAssets)
      .then(data => {
        return data.filter(asset => asset);
      })
      .then(data => {
        let objectData = {};
        if (data) {
          data.forEach(aa => {
            objectData[aa.address] = aa.asset;
          });
        }
        return objectData;
      });
    dispatch(addAssetsToList(extendAssets));
    const allAssets = { ...assets, ...extendAssets };
    // eslint-disable-next-line array-callback-return
    const getExtendSymbols = Object.keys(allAssets).map(address => {
      const asset = address in allAssets ? allAssets[address] : false;
      if (asset) {
        if (address in store.symbols) {
          const latestUpdate = moment(store.symbols[address].latestUpdate);
          if (latestUpdate.isValid()) {
            const yesterday = moment(today).add(-1, "days");
            if (moment(latestUpdate).isSameOrBefore(yesterday)) {
              return client.api
                .getSymbolByAsset(config.TOKEN_REGISTRY_AA_ADDRESS, asset)
                .then(symbol => {
                  if (symbol) {
                    if (asset.replace(/[+=]/, "").substr(0, 6) !== symbol) {
                      return { address: address, symbol, latestUpdate: today };
                    }
                  }
                });
            }
          }
        } else {
          return client.api
            .getSymbolByAsset(config.TOKEN_REGISTRY_AA_ADDRESS, asset)
            .then(symbol => {
              if (symbol) {
                if (asset.replace(/[+=]/, "").substr(0, 6) !== symbol) {
                  return { address: address, symbol, latestUpdate: today };
                }
              }
            });
        }
      } else {
        return null;
      }
    });

    const extendSymbols = await Promise.all(getExtendSymbols)
      .then(data => {
        return data.filter(obj => obj);
      })
      .then(data => {
        let objectData = {};
        if (data) {
          data.forEach(aa => {
            objectData[aa.address] = {
              symbol: aa.symbol,
              latestUpdate: aa.latestUpdate
            };
          });
        }
        return objectData;
      });
    dispatch(addSymbolsToList(extendSymbols));
    if (aaByBase && aaByBase !== []) {
      aaByBase.forEach(aa => {
        aa.isStable = true;
      });
    }

    await dispatch({
      type: LOAD_AA_LIST_SUCCESS,
      payload: aaByBase || []
    });
  } catch (e) {
    console.log("error", e);
  }
};
