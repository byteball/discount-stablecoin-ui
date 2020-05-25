import React from "react";
import { Button, Row } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { t } from "../../../utils";

import styles from "./../LoanListByAddress.module.css";
import config from "../../../config";

export const LoanMobView = ({
  id,
  amount,
  color,
  collateral,
  percent,
  disabledRepayment,
  setLoanId,
  handleClickRepayment,
  timestampUnit,
  address
}) => {
  const activeParams = useSelector(state => state.aa.activeParams);
  const symbol = useSelector(state => state.aa.symbol);
  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const dataRepay = JSON.stringify({ repay: 1, id });
  const dataBase64Repay = btoa(dataRepay);
  const urlRepay = `obyte${
    config.TESTNET ? "-tn" : ""
  }:${active}?amount=${amount}&asset=${encodeURIComponent(
    activeInfo.asset
  )}&base64data=${encodeURIComponent(dataBase64Repay)}&from_address=${address}`;

  return (
    <div
      className={styles.mobRow}
      style={{ color }}
      key={"loan-min-" + amount + "-" + collateral}
    >
      <Row>
      {t("components.loanListByAddress.titles.date")}:{" "}
      {moment.unix(timestampUnit).format("YYYY-MM-DD")}
      </Row>
      <Row>
        {symbol ? symbol : t("components.loanListByAddress.titles.amount")}:{" "}
        {amount / 10 ** activeParams.decimals}
      </Row>
      <Row>
        {t("components.loanListByAddress.titles.collateral")}:{" "}
        {collateral / 10 ** 9} GB ({percent}%)
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Button
          type="primary"
          style={{ marginRight: 25, marginBottom: 10 }}
          onClick={() => setLoanId(id)}
        >
          {t("components.loanListByAddress.actions.collateral")}
        </Button>
        <a
          href={urlRepay}
          className="ant-btn ant-btn-md"
          onClick={handleClickRepayment}
          disabled={disabledRepayment}
        >
          {t("components.loanListByAddress.actions.repayment")}
        </a>
      </Row>
    </div>
  );
};
