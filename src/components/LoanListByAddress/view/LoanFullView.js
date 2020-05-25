import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";
import React from "react";
import moment from "moment";
import { t } from "../../../utils";
import styles from "./../LoanListByAddress.module.css";
import config from "../../../config";

export const LoanFullView = ({
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
    <Row
      key={"loan-" + amount + "-" + collateral + "-"}
      type="flex"
      align="middle"
      className={styles.fullRow}
      style={{ color }}
    >
      <Col xs={{ span: 24, offset: 0 }} md={{ span: 4, offset: 0 }}>
        {moment.unix(timestampUnit).format("YYYY-MM-DD")}
      </Col>
      <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 1 }}>
        {(amount / 10 ** activeParams.decimals).toFixed(activeParams.decimals)}
      </Col>
      <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
        {(collateral / 10 ** 9).toFixed(9)} GB ({percent}%)
      </Col>
      <Col xs={{ span: 24, offset: 0 }} md={{ span: 9, offset: 1 }}>
        <Button
          type="primary"
          style={{ marginRight: 5 }}
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
      </Col>
    </Row>
  );
};
