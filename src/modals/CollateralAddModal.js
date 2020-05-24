import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";

import { redirect, t } from "../utils";
import config from "../config";

const initLoanCollateralState = {
  count: undefined,
  help: "",
  status: "",
  valid: false
};

export const CollateralAddModal = ({ visible, id, onCancel, address, data }) => {
  const [loanCollateral, setLoanCollateral] = useState(initLoanCollateralState);
  const active = useSelector(state => state.aa.active);

  useEffect(()=>{
    if(visible && data.collateral < data.overcollateralization * data.min_collateral){
    const initCount = (Math.ceil(Number(data.overcollateralization) * Number(data.min_collateral) - Number(data.collateral))/ 1e9).toFixed(9);

    setLoanCollateral({
        count: initCount,
        help: "",
        status: "success",
        valid: true
    });
    }
  }, [visible, data])

  const handleChangeCollateralCount = ev => {
    const value = ev.target.value || "";
    const reg = /^[0-9.]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 1e16 / 10 ** 9) {
          if (Number(value) >= 100000 / 10 ** 9) {
            setLoanCollateral({
              ...loanCollateral,
              count: value,
              help: "",
              status: "success",
              valid: true
            });
          } else {
            setLoanCollateral({
              ...loanCollateral,
              count: value,
              help: t("forms.error.minNum", { count: 100000 / 10 ** 9 }),
              status: "error",
              valid: false
            });
          }
        } else {
          setLoanCollateral({
            ...loanCollateral,
            count: value,
            help: t("forms.error.muchValue"),
            status: "error",
            valid: false
          });
        }
      }
    } else {
      setLoanCollateral({
        ...loanCollateral,
        count: undefined,
        help: "",
        status: "",
        valid: false
      });
    }
  };

  const addCollateral = ev => {
    if (ev) {
      ev.preventDefault();
    }
    const data = JSON.stringify({ add_collateral: 1, id });
    const dataBase64 = btoa(data);
    redirect(
      `obyte${
        config.TESTNET ? "-tn" : ""
      }:${active}?amount=${loanCollateral.count *
        10 ** 9}&base64data=${encodeURIComponent(dataBase64)}&from_address=${address}`
    );
    setLoanCollateral(initLoanCollateralState);
    onCancel();
  };
  const handleCancel = () => {
    setLoanCollateral(initLoanCollateralState);
    onCancel();
  };

  const sumCollateral = Number(loanCollateral.count || 0) + (Number(data.collateral)/ 1e9);

  const ratio = visible ? 100 * (sumCollateral / (data.min_collateral / 1e9)) : 0;
  
  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      title={t("modals.collateralAdd.title")}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t("modals.collateralAdd.submits.cancel.name")}
        </Button>,
        <Button
          key="add"
          type="primary"
          onClick={addCollateral}
          disabled={!loanCollateral.valid}
        >
          {t("modals.collateralAdd.submits.add.name")}
        </Button>
      ]}
    >
      <Form onSubmit={addCollateral}>
        <Form.Item
          hasFeedback
          validateStatus={loanCollateral.status}
          help={loanCollateral.help}
        >
          <Input
            placeholder={t("modals.collateralAdd.fields.count.name")}
            onChange={handleChangeCollateralCount}
            value={loanCollateral.count}
            suffix="GB"
            size="large"
          />
        </Form.Item>
        <p>
          Ratio: {Math.floor(ratio) / 100}
        </p>
        <p>
          Collateral: {(sumCollateral).toFixed(9)} GB
        </p>
      </Form>
    </Modal>
  );
};
