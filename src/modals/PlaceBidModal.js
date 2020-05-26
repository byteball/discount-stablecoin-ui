import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";

import { redirect, t } from "../utils";
import config from "../config";

export const PlaceBidModal = ({ visible, id, min, onCancel }) => {
  const initLoanBidState = {
    count: null,
    help: "",
    status: "success",
    valid: true
  };

  const [loanBid, setLoanBid] = useState({ ...initLoanBidState });
  const active = useSelector(state => state.aa.active);
  useEffect(() => {
    if (min) {
      setLoanBid({ ...loanBid, count: min });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min]);
  const handleChangeCollateralCount = ev => {
    const value = ev.target.value || "";
    const reg = /^[0-9.]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 1e16) {
          if (Number(value) >= min / 10 ** 9) {
            setLoanBid({
              ...loanBid,
              count: value,
              help: "",
              status: "success",
              valid: true
            });
          } else {
            setLoanBid({
              ...loanBid,
              count: value,
              help: t("forms.error.minNum", { count: min }),
              status: "error",
              valid: false
            });
          }
        } else {
          setLoanBid({
            ...loanBid,
            count: value,
            help: t("forms.error.muchValue"),
            status: "error",
            valid: false
          });
        }
      }
    } else {
      setLoanBid({
        ...loanBid,
        count: undefined,
        help: "",
        status: "",
        valid: false
      });
    }
  };

  const data = JSON.stringify({ seize: 1, id });
  const dataBase64 = btoa(data);
  const url = `obyte${config.TESTNET ? "-tn" : ""}:${active}?amount=${loanBid.count * 10 ** 9}&asset=base&base64data=${encodeURIComponent(dataBase64)}`;
  
  const addCollateral = ev => {
    if (ev) {
      ev.preventDefault();
    }
    redirect(url);
    setLoanBid(initLoanBidState);
    onCancel();
  };

  const handleCancel = () => {
    setLoanBid(initLoanBidState);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      title={t("modals.placeBid.title") + " (GBYTEs)"}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t("modals.placeBid.submits.cancel.name")}
        </Button>,
        <a
          key="add"
          href={url}
          className="ant-btn ant-btn-primary"
          style={{marginLeft: 10}}
          onClick={addCollateral}
          disabled={!loanBid.valid}
        >
          {t("modals.placeBid.submits.place.name")}
        </a>
      ]}
    >
      <p>{t("modals.placeBid.descr")}</p>
      <Form onSubmit={addCollateral}>
        <Form.Item
          hasFeedback
          validateStatus={loanBid.status}
          help={loanBid.help}
        >
          <Input
            placeholder={t("modals.placeBid.fields.count.name")}
            onChange={handleChangeCollateralCount}
            value={loanBid.count}
            size="large"
            suffix="GB"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
