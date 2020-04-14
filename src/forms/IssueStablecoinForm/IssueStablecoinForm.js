import React, { useState, useRef } from "react";
import { Form, Input, Typography } from "antd";
import { useSelector } from "react-redux";

import { t } from "../../utils";

import config from "../../config";
import { LinkToODEX } from "../../components/LinkToODEX/LinkToODEX";

const { Title } = Typography;

export const IssueStablecoinForm = () => {
  const [count, setCount] = useState("");
  const issueBtn = useRef(null);
  const exchange_rate = useSelector(state => state.aa.activeDataFeed);
  const symbol = useSelector(state => state.aa.symbol);
  const { overcollateralization_ratio, liquidation_ratio } = useSelector(
    state => state.aa.activeParams
  );
  const active = useSelector(state => state.aa.active);
  const handleChange = ev => {
    const getCount = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (reg.test(String(getCount)) || getCount === "") {
      setCount(String(getCount));
    }
  };
  const amount = Number(count);
  const newValue = Math.ceil(
    (1e9 / exchange_rate) * overcollateralization_ratio * amount
  );
  const handleSubmit = ev => {
    ev.preventDefault();
    issueBtn.current.click();
    setCount("");
  };

  const url = `obyte${
    config.TESTNET ? "-tn" : ""
  }:${active}?amount=${newValue}&amp;asset=base`;

  return (
    <Form onSubmit={handleSubmit}>
      <Title level={3}>{t("forms.issueStablecoin.title")}</Title>
      <Form.Item hasFeedback>
        <Input
          size="large"
          placeholder={t("forms.issueStablecoin.fields.count.name")}
          onChange={handleChange}
          value={count}
        />
      </Form.Item>
      <Form.Item>
        <a
          href={url}
          className="ant-btn ant-btn-primary"
          ref={issueBtn}
          disabled={count === ""}
        >
          {t("forms.issueStablecoin.submit", {
            newValue: newValue / 10 ** 9
          })}
        </a>
        <LinkToODEX
          symbol={symbol}
          style={{ paddingLeft: 10, paddingRight: 10, whiteSpace: "pre" }}
        />
      </Form.Item>
      {overcollateralization_ratio && liquidation_ratio && (
        <div style={{ marginBottom: 15 }}>
          You’ll get your collateral back when you return the stablecoins.{" "}
          Initial collateral {Number(overcollateralization_ratio) * 100}%,
          minimum collateral {Number(liquidation_ratio) * 100}%.
        </div>
      )}
    </Form>
  );
};
