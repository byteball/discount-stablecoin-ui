import React from "react";
import { Statistic, Typography } from "antd";
import { useSelector } from "react-redux";

import config from "../../config";
import base64url from "base64url";
import { t } from "../../utils";
import { ExchangeStablecoinForm } from "../ExchangeStablecoinForm/ExchangeStablecoinForm";
import { LinkToODEX } from "../../components/LinkToODEX/LinkToODEX";

const { Title } = Typography;

export const ExpiredForm = () => {
  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const symbol = useSelector(state => state.aa.symbol);
  const expiry_exchange_rate = activeInfo.expiry_exchange_rate || null;
  const dataString = JSON.stringify({ expire: 1 });
  const dataBase64 = base64url(dataString);

  return (
    <div style={{ marginBottom: 20 }}>
      {expiry_exchange_rate ? (
        <>
          <Title level={3}>{t("forms.expired.title_rate")}</Title>
          <Statistic
            value={Number(expiry_exchange_rate)}
            suffix={<small>{symbol ? symbol : "STABLECOINS"}</small>}
          />
          <LinkToODEX symbol={symbol} style={{ whiteSpace: "pre" }} />
          <ExchangeStablecoinForm />
        </>
      ) : (
        <div>
          <Title level={3}>{t("forms.expired.title_send_expiry")}</Title>
          <p style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.45)" }}>
            {t("forms.expired.description")}
          </p>
          <a
            className="ant-btn ant-btn-primary"
            href={`obyte${
              config.TESTNET ? "-tn" : ""
            }:${active}?amount=10000&base64data=${encodeURIComponent(dataBase64)}`}
          >
            {t("forms.expired.submit")}
          </a>
        </div>
      )}
    </div>
  );
};
