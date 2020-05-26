import { Button, Col, Row } from "antd";
import { useSelector } from "react-redux";
import React from "react";
import moment from "moment";
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
  handleClickRepayment,
  unitTimestamp,
  urlRepay
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
      <Col xs={{ span: 24, offset: 0 }} md={{ span: 4, offset: 0 }}>
        {moment.unix(unitTimestamp).format("YYYY-MM-DD")}
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
