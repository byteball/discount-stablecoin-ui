import React from "react";
import { Button, Collapse, Icon, Row, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { t } from "../../utils";
import styles from "../LabelForm/LabelForm.module.css";
import config from "../../config";
import { tokenRegistrySwitch } from "../../store/actions/deploy";

const { Panel } = Collapse;

export const ParamsView = ({ panelActive, setPanelActive }) => {
  let history = useHistory();
  const {
    overcollateralization_ratio,
    decimals,
    oracle,
    max_loan_value_in_underlying,
    auction_period,
    liquidation_ratio,
    feed_name,
    ma_feed_name,
    expiry_date
  } = useSelector(state => state.aa.activeParams);
  const aaActive = useSelector(state => state.aa.active);
  const { asset } = useSelector(state => state.aa.activeInfo);
  const symbol = useSelector(state => state.aa.symbol);
  const activeDataFeed = useSelector(state => state.aa.activeDataFeed);
  const activeDataFeedMa = useSelector(state => state.aa.activeDataFeedMa);
  const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    border: 0,
    overflow: "hidden"
  };
  const dispatch = useDispatch();
  return (
    <Row>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
        activeKey={panelActive}
        onChange={key => {
          setPanelActive(key);
        }}
      >
        <Panel
          header={t("components.paramsView.title")}
          key="1"
          style={customPanelStyle}
        >
          {oracle && (
            <p>
              <b>{t("components.paramsView.params.oracle")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.oracle.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {oracle}
            </p>
          )}
          {decimals && max_loan_value_in_underlying && (
            <p>
              <b>{t("components.paramsView.params.maxLoan")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.maxLoan.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {max_loan_value_in_underlying / 10 ** decimals}{" "}
              {symbol ? symbol : "stablecoins"}
            </p>
          )}
          {feed_name && (
            <p>
              <b>{t("components.paramsView.params.feedName")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.feedName.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {feed_name}{" "}
              {activeDataFeed && `(Latest value: ${activeDataFeed})`}
            </p>
          )}
          {ma_feed_name && (
            <p>
              <b>{t("components.paramsView.params.maFeedName")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.maFeedName.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {ma_feed_name}{" "}
              {activeDataFeedMa && `(Latest value: ${activeDataFeedMa})`}
            </p>
          )}
          {auction_period && (
            <p>
              <b>{t("components.paramsView.params.auctionPeriod")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.auctionPeriod.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {auction_period}
            </p>
          )}
          {decimals && (
            <p>
              <b>{t("components.paramsView.params.decimals")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.decimals.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {decimals}
            </p>
          )}
          {overcollateralization_ratio && (
            <p>
              <b>
                {t("components.paramsView.params.overCollateralizationRatio")}{" "}
              </b>
              <Tooltip
                title={t(
                  `forms.deploy.fields.overCollateralizationRatio.descr`
                )}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {overcollateralization_ratio}
            </p>
          )}
          {liquidation_ratio && (
            <p>
              <b>{t("components.paramsView.params.liquidationRatio")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.liquidationRatio.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {liquidation_ratio}
            </p>
          )}
          {expiry_date && (
            <p>
              <b>{t("components.paramsView.params.expiryDate")} </b>
              <Tooltip
                title={t(`forms.deploy.fields.expiryDate.descr`)}
                placement="top"
              >
                <Icon
                  // style={{ marginRight: 5 }}
                  type="info-circle"
                  className={styles.icon}
                />
              </Tooltip>
              <b>{" : "}</b> {expiry_date}
            </p>
          )}
          {asset && (
            <p>
              <b>Symbol: </b>
              {symbol || "none"}{" "}
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  dispatch(tokenRegistrySwitch(true));
                  history.push("/");
                  setPanelActive(null);
                }}
              >
                {symbol
                  ? "register another symbol for this stablecoin"
                  : "register a symbol for this stablecoin"}
              </Button>
            </p>
          )}
          <div>
            {aaActive && (
              <a
                href={`https://${config.TESTNET ?
                  "testnet" : ""}explorer.obyte.org/#${aaActive}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on explorer
              </a>
            )}
          </div>
        </Panel>
      </Collapse>
    </Row>
  );
};
