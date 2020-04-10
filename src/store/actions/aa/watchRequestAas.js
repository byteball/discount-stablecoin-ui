import { isEqual } from "lodash";
import { notification } from "antd";

import client from "../../../socket";
import {
  createObjectNotification,
  createStringDescrForAa,
  t
} from "../../../utils";
import { ADD_AA_TO_LIST, ASSET_REQUEST, ASSET_RESPONSE } from "../../types/aa";
import {
  deployRequest,
  pendingDeployResponse,
  tokenRegistryClose
} from "../deploy";
import { ADD_AA_NOTIFICATION } from "../../types/notifications";
import { changeActiveAA } from "./index";
import {
  addBidForCoinAuction,
  endAuctionRequest,
  endAuctionResponse
} from "../auction";
import { addCollateral } from "./addCollateral";
import { repayLoan } from "./repayLoan";
import { expiryExchangeRate } from "./expiryExchangeRate";
import { issueStableCoin } from "./issueStableCoin";
import config from "../../../config";
import { addSymbol } from "./addSymbol";

export const watchRequestAas = () => (dispatch, getState) => {
  try {
    client.subscribe(async (err, result) => {
      const store = getState();
      const aaActive = store.aa.active;
      const { symbols } = store;
      const openNotificationRequest = (address, event) => {
        notification.open({
          message: address in symbols ? symbols[address].symbol : address,
          description: event,
          // duration: null,
          style: { minWidth: 360, paddingLeft: 12, paddingRight: 12 }
        });
      };

      if (result[1].subject === "light/aa_definition") {
        const address =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.address;

        if (address) {
          const params =
            result[1].body.messages[0].payload.definition &&
            result[1].body.messages[0].payload.definition[1] &&
            result[1].body.messages[0].payload.definition[1].params;
          openNotificationRequest(
            t("notifications.deploy.req.title", {
              address,
              feed_name: params.feed_name,
              expiry_date: params.expiry_date
            }),
            null
          );

          if (
            store.deploy.pending &&
            params &&
            isEqual(store.deploy.deployAaPrams, params)
          ) {
            const address = result[1].body.messages[0].payload.address;
            const definition = result[1].body.messages[0].payload.definition;
            if (address && definition) {
              const { feed_name, expiry_date } = definition[1].params;
              const view = createStringDescrForAa(
                address,
                feed_name,
                expiry_date
              );
              await dispatch({
                type: ADD_AA_TO_LIST,
                payload: { address, definition, view, isStable: false }
              });
              await dispatch(deployRequest(address));
              await dispatch(changeActiveAA(address));
            }
          }
        }
      } else if (result[1].subject === "light/aa_definition_saved") {
        const address =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.address;
        const definition =
          result[1].body.messages[0].payload &&
          result[1].body.messages[0].payload.definition;
        if (address && definition) {
          const { feed_name, expiry_date } = definition[1].params;
          const view = createStringDescrForAa(address, feed_name, expiry_date);
          openNotificationRequest(
            t("notifications.deploy.res.title", {
              address,
              feed_name,
              expiry_date
            }),
            null
          );
          dispatch({
            type: ADD_AA_TO_LIST,
            payload: { address, definition, view, isStable: true }
          });
          if (address === store.deploy.wasIssued) {
            dispatch(pendingDeployResponse());
          }
        }
      } else if (result[1].subject === "light/aa_request") {
        const AA = result[1].body.aa_address;
        const aaVars =
          store.deploy.wasIssued !== AA
            ? await client.api.getAaStateVars({ address: AA })
            : {};
        if (
          result[1].body &&
          result[1].body.aa_address &&
          result[1].body.unit.messages &&
          result[1].body.unit.messages[0]
        ) {
          const notificationObject = createObjectNotification.req(
            result[1],
            aaVars
          );
          if (result[1].body.aa_address === config.TOKEN_REGISTRY_AA_ADDRESS) {
            const payload = result[1].body.unit.messages[0].payload;
            if (payload) {
              if (payload.symbol && payload.asset) {
                const activeAsset =
                  "asset" in store.aa.activeInfo
                    ? store.aa.activeInfo.asset
                    : false;
                if (activeAsset) {
                  if (activeAsset === payload.asset) {
                    openNotificationRequest(
                      aaActive,
                      t("notifications.regSymbol.req.title", {
                        symbol: payload.symbol
                      })
                    );
                    dispatch(tokenRegistryClose());
                  }
                }
              }
            }
          }
          if (
            (notificationObject && notificationObject.AA === aaActive) ||
            (!aaActive && notificationObject)
          ) {
            if (notificationObject.tag === "req_asset") {
              const list = store.aa.listByBase;
              const aaInfo = list.filter(
                aa => aa.address === notificationObject.AA
              );
              if ("definition" in aaInfo["0"]) {
                const { expiry_date, feed_name } = aaInfo[
                  "0"
                ].definition[1].params;

                openNotificationRequest(
                  notificationObject.AA,
                  t("notifications.asset.req.title", {
                    expiry_date,
                    feed_name
                  })
                );
              }
            } else if (notificationObject.tag === "req_stable") {
              const list = store.aa.listByBase;
              const aaInfo = list.filter(
                aa => aa.address === notificationObject.AA
              );
              if ("definition" in aaInfo["0"]) {
                const {
                  feed_name,
                  oracle,
                  overcollateralization_ratio
                } = aaInfo["0"].definition[1].params;
                let data_feed;
                try {
                  data_feed = await client.api.getDataFeed({
                    oracles: [oracle],
                    feed_name: feed_name,
                    ifnone: "none"
                  });
                } catch (e) {
                  console.log("error", e);
                }

                if (data_feed && data_feed !== "none") {
                  let count;
                  if ("expiry_exchange_rate" in aaVars) {
                    count =
                      notificationObject.meta.collateral /
                      (1e9 / aaVars.expiry_exchange_rate);
                  } else {
                    count =
                      notificationObject.meta.collateral /
                      ((1e9 / data_feed) * overcollateralization_ratio);
                  }

                  openNotificationRequest(
                    notificationObject.AA,
                    t("notifications.issueStablecoin.req.title", {
                      address: notificationObject.meta.address,
                      count: count.toFixed(2)
                    })
                  );
                }
              }
            } else {
              openNotificationRequest(
                notificationObject.AA,
                notificationObject.title
              );
            }
            if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_asset"
            ) {
              dispatch({
                type: ASSET_REQUEST
              });
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_seize"
            ) {
              const meta = notificationObject.meta;
              dispatch(
                addBidForCoinAuction(
                  meta.id,
                  meta.newBid,
                  meta.timestamp,
                  false
                )
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_repay"
            ) {
              const meta = notificationObject.meta;
              dispatch(repayLoan(meta.id, meta.address));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "req_end"
            ) {
              const meta = notificationObject.meta;
              dispatch(endAuctionRequest(meta.id));
            }
          }
        }
      } else if (result[1].subject === "light/aa_response") {
        const AA = result[1].body.aa_address;
        const aaVars = await client.api.getAaStateVars({ address: AA });
        if (result[1].body && result[1].body.response) {
          const decimals = store.aa.activeParams.decimals;
          const notificationObject = createObjectNotification.res(
            result[1].body,
            aaVars,
            decimals
          );
          if (result[1].body.aa_address === config.TOKEN_REGISTRY_AA_ADDRESS) {
            const res = result[1].body.response;
            if (res.responseVars) {
              const asset =
                  store.aa.activeInfo && "asset" in store.aa.activeInfo && store.aa.activeInfo.asset;
              if (asset) {
                if (asset in res.responseVars) {
                  const symbol = res.responseVars[asset];
                  dispatch(addSymbol(symbol));
                  openNotificationRequest(
                    aaActive,
                    t("notifications.regSymbol.res.title", {
                      symbol
                    })
                  );
                }
              }
            }
          }
          if (
            (notificationObject && notificationObject.AA === aaActive) ||
            (!aaActive && notificationObject)
          ) {
            if (notificationObject.tag === "res_asset") {
              const list = store.aa.listByBase;
              const aaInfo = list.filter(
                aa => aa.address === notificationObject.AA
              );
              if ("definition" in aaInfo["0"]) {
                const { expiry_date, feed_name } = aaInfo[
                  "0"
                ].definition[1].params;

                openNotificationRequest(
                  notificationObject.AA,
                  t("notifications.asset.res.title", {
                    expiry_date,
                    feed_name
                  })
                );
              }
            } else {
              openNotificationRequest(
                notificationObject.AA,
                notificationObject.title
              );
            }
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: notificationObject
            });
            if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_seize"
            ) {
              const meta = notificationObject.meta;
              if (!meta.id && !meta.newBid) {
                console.log("size_err");
              }
              dispatch(
                addBidForCoinAuction(meta.id, meta.newBid, meta.timestamp, true)
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_collateral"
            ) {
              const meta = notificationObject.meta;
              dispatch(addCollateral(meta.id, meta.collateral));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_repay"
            ) {
              const meta = notificationObject.meta;
              dispatch(repayLoan(meta.id, meta.address));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_expire"
            ) {
              const meta = notificationObject.meta;
              dispatch(expiryExchangeRate(meta.rate));
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_stable"
            ) {
              const meta = notificationObject.meta;
              dispatch(
                issueStableCoin({
                  id: meta.id,
                  owner: meta.owner,
                  collateral: meta.collateral,
                  amount: meta.amount
                })
              );
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_asset"
            ) {
              dispatch({
                type: ASSET_RESPONSE,
                payload: notificationObject.meta
              });
            } else if (
              aaActive === notificationObject.AA &&
              notificationObject.tag === "res_au_end"
            ) {
              const meta = notificationObject.meta;
              if ("owner" in meta && "collateral" in meta && "id" in meta) {
                dispatch(
                  endAuctionResponse(meta.id, meta.owner, meta.collateral)
                );
              } else {
                dispatch(endAuctionRequest(meta.id));
              }
            }
          }
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};
