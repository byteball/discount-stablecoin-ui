import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";
import React from "react";
import { t } from "../../../utils";
import styles from "./../LoanListByAddress.module.css";

export const LoanFullView = ({
  id,
  amount,
  color,
  collateral,
  percent,
  disabledRepayment,
  setLoanId,
  handleClickRepayment
}) => {
  const activeParams = useSelector(state => state.aa.activeParams);
  return (
    <Row
      key={"loan-" + amount + "-" + collateral + "-"}
      type="flex"
      align="middle"
      className={styles.fullRow}
      style={{ color }}
    >
      <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 0 }}>
        {(amount / 10 ** activeParams.decimals).toFixed(activeParams.decimals)}
      </Col>
      <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
        {(collateral / 10 ** 9).toFixed(9)} GB ({percent}%)
      </Col>
      <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 1 }}>
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={() => setLoanId(id)}
        >
          {t("components.loanListByAddress.actions.collateral")}
        </Button>
        <Button
          onClick={() => handleClickRepayment(id, amount)}
          disabled={disabledRepayment}
        >
          {t("components.loanListByAddress.actions.repayment")}
        </Button>
      </Col>
    </Row>
  );
};
