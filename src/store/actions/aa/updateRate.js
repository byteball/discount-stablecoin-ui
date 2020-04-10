import client from "../../../socket";
import { UPDATE_RATE } from "../../types/aa";
import moment from "moment";
import { initAuction } from "../auction";

export const updateRate = () => async (dispatch, getState) => {
  const store = getState();
  const address = store.aa.active;
  const coins = store.aa.activeCoins;
  const activeInfo = store.aa.activeInfo;
  if (address) {
    const definitionActive = store.aa.listByBase.filter(
      aa => aa.address === address
    );
    const params =
      definitionActive && definitionActive[0].definition["1"].params;
    if (!("expiry_exchange_rate" in activeInfo)) {
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
        if (
          data_feed !== "none" &&
          data_feed_ma !== "none" &&
          (store.aa.activeDataFeed !== data_feed ||
            store.aa.activeDataFeedMa !== data_feed_ma)
        ) {
          const auctionCoins = {};
          for (let id in coins) {
            if (
              !("expired" in coins[id]) &&
              "amount" in coins[id] &&
              "collateral" in coins[id] &&
              !("repaid" in coins[id]) &&
              Number(coins[id].amount) !== 0
            ) {
              const exchange_rate =
                "expiry_exchange_rate" in store.aa.activeInfo
                  ? Number(store.aa.activeInfo.expiry_exchange_rate)
                  : Number(data_feed_ma);
              //test
              const min_collateral =
                (coins[id].amount /
                  Math.pow(10, store.aa.activeParams.decimals) /
                  exchange_rate) *
                1e9;
              const min_collateral_liquidation = Math.round(
                min_collateral * store.aa.activeParams.liquidation_ratio
              );

              coins[id].atAuction =
                coins[id].collateral < min_collateral_liquidation;
              if (coins[id].collateral < min_collateral_liquidation) {
                const DateNow = moment().unix();
                const isEnded =
                  moment(DateNow) > Number(coins[id].auction_end_ts);
                auctionCoins[id] = { ...coins[id] };
                auctionCoins[id].opening_collateral = Math.round(
                  min_collateral *
                    store.aa.activeParams.overcollateralization_ratio
                );
                if (!("winner_bid" in coins[id])) {
                  auctionCoins[id].status = "open";
                } else if ("winner_bid" in coins[id] && isEnded) {
                  auctionCoins[id].status = "end";
                } else if ("winner_bid" in coins[id] && !isEnded) {
                  auctionCoins[id].status = "active";
                }
              }
            }
          }

          await dispatch(initAuction(auctionCoins));
          await dispatch({
            type: UPDATE_RATE,
            payload: { data_feed, data_feed_ma }
          });
        }
      } catch (e) {
        console.log("error", e);
      }
    }
  }
};
