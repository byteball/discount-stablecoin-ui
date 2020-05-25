import React, { useState } from "react";
import { Row, Col, Empty } from "antd";
import { useSelector } from "react-redux";

import { CollateralAddModal } from "../../modals/CollateralAddModal";
import { LoanFullView, LoanMobView } from "./view";
import { useWindowSize } from "../../hooks/useWindowSize";
import { t } from "../../utils";

import styles from "./LoanListByAddress.module.css";
import { truncate } from "lodash";
import ReactGA from "react-ga";

export const LoanListByAddress = ({ address }) => {
  const [width] = useWindowSize();
  const walletsInfo = useSelector(state => state.aa.activeCoins);
  const exchange_rate = useSelector(state => state.aa.activeDataFeedMa);
  const activeParams = useSelector(state => state.aa.activeParams);
  const symbol = useSelector(state => state.aa.symbol);

  const [loanId, setLoanId] = useState(null);

  let list = [];
  for (const fields in walletsInfo) {
    const min_collateral =
      (walletsInfo[fields].amount /
        Math.pow(10, activeParams.decimals) /
        exchange_rate) *
      1e9;
    const percent = Math.floor(
      (walletsInfo[fields].collateral / min_collateral) * 100
    );

    const isRepaid = "repaid" in walletsInfo[fields];
    if (
      walletsInfo[fields].owner === address &&
      !isRepaid &&
      Number(walletsInfo[fields].amount) !== 0
    ) {
      list.push({
        id: fields,
        collateral: walletsInfo[fields].collateral,
        amount: walletsInfo[fields].amount,
        percent: percent,
        atAuction: walletsInfo[fields].atAuction,
        timestampUnit: walletsInfo[fields].timestampUnit,
        min_collateral
      });
    }
  }
  let LoanList;
  const loanListInfo = list.map(el => {
    return {
      ...el,
      color: el.atAuction ? "red" : "green",
      disabledRepayment: el.atAuction,
      address,
    };
  }).sort((a, b) => b.timestampUnit - a.timestampUnit);

  const handleClickRepayment = (ev) => {
    ReactGA.event({
      category: 'Stablecoin',
      action: 'Exchange stablecoin for GBYTEs',
      label: 'before the expiration date (Repay the loan)',
    });
    
  };
  if (width > 768 && list.length > 0) {
    LoanList = loanListInfo.map((info, i) => (
      <LoanFullView
        {...info}
        key={"LoanFullView-" + i}
        setLoanId={setLoanId}
        handleClickRepayment={handleClickRepayment}
      />
    ));
  } else if (list.length > 0) {
    LoanList = loanListInfo.map((info, i) => (
      <LoanMobView
        {...info}
        key={"LoanFullView-" + i}
        setLoanId={setLoanId}
        handleClickRepayment={handleClickRepayment}
      />
    ));
  } else if (address !== "") {
    LoanList = (
      <Empty
        description={t("components.loanListByAddress.empty")}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const currentLoanData = loanListInfo.find((data)=> loanId === data.id);
  
  return (
    <div>
      <CollateralAddModal
        visible={!!loanId}
        id={loanId}
        address={address}
        data={{...currentLoanData, overcollateralization: activeParams.overcollateralization_ratio}}
        onCancel={() => setLoanId(null)}
      />
      {LoanList && LoanList.length > 0 && width > 768 && (
        <Row className={styles.mobTitle}>
          <Col xs={{ span: 24, offset: 0 }} md={{ span: 4, offset: 0 }}>
            {t("components.loanListByAddress.titles.date")}
          </Col>
          <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 1 }}>
            {symbol
              ? truncate(symbol, { length: 12 })
              : t("components.loanListByAddress.titles.amount")}
          </Col>
          <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
            {t("components.loanListByAddress.titles.collateral")}
          </Col>
          <Col xs={{ span: 24, offset: 0 }} md={{ span: 9, offset: 1 }}>
            {t("components.loanListByAddress.titles.actions")}
          </Col>
        </Row>
      )}
      {LoanList}
    </div>
  );
};
