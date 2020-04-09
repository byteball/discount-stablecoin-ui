import React from "react";
import { Button, Row } from "antd";
import { useSelector } from "react-redux";

import { t } from "../../../utils";

import styles from "./../LoanListByAddress.module.css";

export const LoanMobView = ({
  id,
  amount,
  color,
  collateral,
  percent,
  disabledRepayment,
  setIdCollateral,
  handleClickRepayment
}) => {
  const activeParams = useSelector(state => state.aa.activeParams);
  const symbol = useSelector(state => state.aa.symbol);
  return (
    <div
      className={styles.mobRow}
      style={{ color }}
      key={"loan-min-" + amount + "-" + collateral}
    >
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
          style={{ marginRight: 25 }}
          onClick={() => setIdCollateral(id)}
        >
          {t("components.loanListByAddress.actions.collateral")}
        </Button>
        <Button
          onClick={() => handleClickRepayment(id, amount)}
          disabled={disabledRepayment}
        >
          {t("components.loanListByAddress.actions.repayment")}
        </Button>
      </Row>
    </div>
  );
};
