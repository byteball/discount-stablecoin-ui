import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Statistic, Button, Tooltip } from "antd";
import { endCoinAuction } from "../../../store/actions/auction";
import moment from "moment";
import { truncate } from "lodash";
import config from "../../../config";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
const { Countdown } = Statistic;

export const AuctionFull = ({ data }) => {
  const { decimals } = useSelector(state => state.aa.activeParams);
  const active = useSelector(state => state.aa.active);
  const symbol = useSelector(state => state.aa.symbol);
  return (
    <>
      <Row
        type={"flex"}
        align="middle"
        style={{
          marginTop: 30,
          marginBottom: 30,
          fontWeight: "bold",
          fontSize: 16
        }}
        gutter={10}
      >
        <Col xl={{ span: 3 }}>
          Loan amount (
          {symbol ? truncate(symbol, { length: 12 }) : "stablecoins"})
        </Col>
        <Col xl={{ span: 3 }}>Owner</Col>
        <Col xl={{ span: 4 }}>Collateral (GB)</Col>
        <Col xl={{ span: 3 }}>Time until ends</Col>
        <Col xl={{ span: 4 }}>Current/Min Bid (GB)</Col>
        <Col xl={{ span: 4 }}>Expected profit (GB)</Col>
      </Row>
      {data.map(coin => (
        <Lot
          {...coin}
          decimals={decimals}
          active={active}
          key={coin.id + "-lot"}
        />
      ))}
    </>
  );
};

const Lot = ({
  collateral,
  auction_end_ts,
  bid,
  percent,
  profit,
  id,
  amount,
  owner,
  status,
  decimals,
  active,
  dataBase64,
  current_bid,
  setActiveBidInfo,
  isYour
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("", { i18n });
  const amountValue =
    amount && decimals && !isNaN(amount) ? amount / 10 ** Number(decimals) : 0;
  return (
    <Row
      type="flex"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        backgroundColor: isYour ? "#EDEDED" : "none"
      }}
      gutter={10}
      align="middle"
    >
      <Col xl={{ span: 3 }}>{amountValue}</Col>
      <Col xl={{ span: 3 }}>
        <Tooltip title={owner}>
          <span>{truncate(owner, { length: 9 })}</span>
        </Tooltip>
      </Col>
      <Col xl={{ span: 4 }}>
        {(collateral / 10 ** 9).toFixed(9)}{" "}
        {percent && <span>({percent}%)</span>}
      </Col>
      <Col xl={{ span: 3 }}>
        {auction_end_ts ? (
          <>
            {moment().isBefore(moment.unix(auction_end_ts)) ? (
              <Countdown
                value={moment.unix(auction_end_ts).utc()}
                onFinish={() => dispatch(endCoinAuction(id))}
                valueStyle={{ fontSize: 16 }}
              />
            ) : (
              "expired"
            )}
          </>
        ) : (
          "—"
        )}
      </Col>
      <Col xl={{ span: 4 }}>{(current_bid / 10 ** 9).toFixed(9)}</Col>
      <Col xl={{ span: 4 }} style={{ color: profit > 0 ? "green" : "red" }}>
        ~{(profit / 10 ** 9).toFixed(9)}
      </Col>
      <Col xl={{ span: 3 }}>
        {status === "end" ? (
          <a
            className="ant-btn ant-btn-primary"
            href={`obyte${
              config.TESTNET ? "-tn" : ""
            }:${active}?amount=10000&base64data=${dataBase64}`}
          >
            {t("pages.auction.actions.end")}
          </a>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setActiveBidInfo({
                min: Math.ceil(bid) / 10 ** 9,
                id,
                visible: true
              });
            }}
          >
            {t("pages.auction.actions.bid")}
          </Button>
        )}
      </Col>
    </Row>
  );
};
