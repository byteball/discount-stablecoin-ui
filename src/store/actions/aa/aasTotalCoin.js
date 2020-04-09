import {
  AAS_TOTAL_COIN_LIST_REQUEST,
  AAS_TOTAL_COIN_LIST_SUCCESS
} from "../../types/aa";
import client from "../../../socket";

export const aasTotalCoin = () => async (dispatch, getState) => {
  try {
    const store = getState();
    await dispatch({
      type: AAS_TOTAL_COIN_LIST_REQUEST
    });
    let totalPromises;
    const aaByBase = store.aa.listByBase;
    if (aaByBase && aaByBase !== []) {
      const aaByBaseStable = aaByBase.filter(aa => aa.isStable);
      totalPromises = aaByBaseStable.map(aa => {
        return client.api
          .getAaStateVars({
            address: aa.address,
            var_prefix: "circulating_supply"
          })
          .then(data => {
            const total =
              "circulating_supply" in data ? data.circulating_supply : "0";
            return { address: aa.address, total };
          });
      });
    }
    const totals = await Promise.all(totalPromises)
      .then(data => {
        return data.reduce((sum, current) => {
          return {
            ...sum,
            [current.address]: current.total
          };
        }, {});
      })
      .catch(err => console.log(err));
    await dispatch({
      type: AAS_TOTAL_COIN_LIST_SUCCESS,
      payload: totals
    });
  } catch (e) {
    console.log("error", e);
  }
};
