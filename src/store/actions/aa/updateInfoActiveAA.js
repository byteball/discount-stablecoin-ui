import client from "../../../socket";
import { UPDATE_INFO_ACTIVE_AA } from "../../types/aa";
import { addForAuction, removeForAuction } from "../auction";
import moment from "moment";

export const updateInfoActiveAA = address => async (dispatch, getState) => {
  try {
    const store = getState();
    const auction = store.auction.coins;
    const params = store.aa.activeParams;
    if (store.deploy.wasIssued !== address) {
      const DateNow = moment()
        .utc(false)
        .unix();
      const isExpired = DateNow > moment(params.expiry_date).unix();
      const aaState = await client.api.getAaStateVars({ address });
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
        console.log(e);
      }
      let coins = {};
      for (const fields in aaState) {
        const field = fields.split("_");
        if (field.length === 2 && field[0] !== "circulating") {
          const [name, type] = field;
          coins[name] = {
            ...coins[name],
            [type]: aaState[fields]
          };
        } else if (field.length === 3) {
          const name = field[0];
          const type = field[1] + "_" + field[2];
          coins[name] = {
            ...coins[name],
            [type]: aaState[fields]
          };
        } else if (field.length === 4) {
          const name = field[0];
          const type = field[1] + "_" + field[2] + "_" + field[3];
          coins[name] = {
            ...coins[name],
            [type]: aaState[fields]
          };
        }
      }
      for (let id in coins) {
        if (
          !("expired" in coins[id]) &&
          "amount" in coins[id] &&
          "collateral" in coins[id] &&
          Number(coins[id].amount) !== 0
        ) {
          const exchange_rate = store.aa.activeDataFeedMa;
          const min_collateral =
            (coins[id].amount / 100 / exchange_rate) * 1e9;
          const min_collateral_liquidation = Math.ceil(
            min_collateral * store.aa.activeParams.liquidation_ratio
          );
          const percent = Math.ceil(
            (coins[id].collateral / min_collateral) * 100
          );

          coins[id].atAuction =
            coins[id].collateral < min_collateral_liquidation;
          coins[id].percent = percent;
          if (coins[id].atAuction && !(id in auction)) {
            const opening_collateral = Math.round(
              min_collateral * store.aa.activeParams.overcollateralization_ratio
            );
            dispatch(
              addForAuction({
                [id]: { ...coins[id], opening_collateral, status: "open" }
              })
            );
          } else if (!coins[id].atAuction && id in auction) {
            dispatch(removeForAuction(id));
          }
        }
      }
      dispatch({
        type: UPDATE_INFO_ACTIVE_AA,
        payload: {
          address,
          aaVars: aaState,
          data_feed,
          data_feed_ma,
          coins,
          isExpired
        }
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
