import React, { useRef, useState } from "react";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import config from "../../config";
import { truncate } from "lodash";

export const ExchangeStablecoinForm = () => {
  const [countStable, setCountStable] = useState("");
  const [countGbyte, setCountGbyte] = useState("");
  const issueBtnGbyte = useRef(null);
  const issueBtnStable = useRef(null);

  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const symbol = useSelector(state => state.aa.symbol);
  const { decimals } = useSelector(state => state.aa.activeParams);
  const expiry_exchange_rate = Number(activeInfo.expiry_exchange_rate);
  const urlStable = `obyte${
    config.TESTNET ? "-tn" : ""
  }:${active}?amount=${countStable * 10 ** decimals}&asset=${encodeURIComponent(
    activeInfo.asset
  )}`;
  const urlGbyte = `obyte${
    config.TESTNET ? "-tn" : ""
  }:${active}?amount=${countGbyte * 10 ** 9}&asset=base
  `;
  const handleChangeStable = ev => {
    const getCount = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (reg.test(String(getCount)) || getCount === "") {
      setCountStable(String(getCount));
    }
  };
  const handleChangeGbyte = ev => {
    const getCount = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (reg.test(String(getCount)) || getCount === "") {
      setCountGbyte(String(getCount));
    }
  };
  const handleSubmitStable = ev => {
    ev.preventDefault();
    issueBtnStable.current.click();
    setCountStable("");
  };
  const handleSubmitGbyte = ev => {
    ev.preventDefault();
    issueBtnGbyte.current.click();
    setCountGbyte("");
  };
  return (
    <>
      <Form
        layout="inline"
        style={{ marginTop: 25 }}
        onSubmit={handleSubmitStable}
      >
        <Form.Item
          extra={
            <small>
              You will get{" "}
              {(Number(countStable) * (1 / expiry_exchange_rate)).toFixed(9)}{" "}
              GBYTEs
            </small>
          }
        >
          <Input
            placeholder="Count of stablecoin"
            size="large"
            onChange={handleChangeStable}
            value={countStable}
            // style={{ marginBottom: 15 }}
          />
        </Form.Item>
        <Form.Item>
          <a
            href={urlStable}
            className="ant-btn ant-btn-primary ant-btn-lg"
            ref={issueBtnStable}
            disabled={countStable === "" || Number(countStable) === 0}
          >
            Exchange for GBYTEs
          </a>
        </Form.Item>
      </Form>
      <Form
        layout="inline"
        style={{ marginTop: 25 }}
        onSubmit={handleSubmitGbyte}
      >
        <Form.Item
          extra={
            <small>
              You will get{" "}
              {(Number(countGbyte) * expiry_exchange_rate).toFixed(
                Number(decimals)
              )}{" "}
              {symbol ? truncate(symbol, { length: 12 }) : "stablecoins"}
            </small>
          }
        >
          <Input
            placeholder="Count of GBYTEs"
            size="large"
            onChange={handleChangeGbyte}
            value={countGbyte}
          />
        </Form.Item>

        <Form.Item>
          <a
            href={urlGbyte}
            className="ant-btn ant-btn-primary ant-btn-lg"
            ref={issueBtnGbyte}
            disabled={countGbyte === "" || Number(countGbyte) === 0}
          >
            Exchange for{" "}
            {symbol ? truncate(symbol, { length: 12 }) : "stablecoins"}
          </a>
        </Form.Item>
      </Form>
    </>
  );
};
