import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { truncate } from "lodash";
import moment from "moment";
import ReactGA from 'react-ga';
import { Layout } from "../../components/Layout/Layout";
import { Row, Col, Statistic, Result } from "antd";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { LoanListByAddress } from "../../components/LoanListByAddress/LoanListByAddress";
import { IssueStablecoinForm, WalletForm } from "../../forms";
import { useSelector, useDispatch } from "react-redux";
import { IssueAsset } from "../../components/IssueAsset/IssueAsset";
import { ExpiredForm } from "../../forms/ExpiredForm/ExpiredForm";
import { changeExpiryStatus } from "../../store/actions/aa";
import { RegistryToken } from "../../components/RegistryToken/RegistryToken";
const { Countdown } = Statistic;

export const HomePage = props => {

  useEffect(()=>{
    ReactGA.pageview("/");
  },[])

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const active = useSelector(state => state.aa.active);
  const activeParams = useSelector(state => state.aa.activeParams);
  const activeCoins = useSelector(state => state.aa.activeCoins);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const activeDataFeedMa = useSelector(state => state.aa.activeDataFeedMa);
  const activeDataFeed = useSelector(state => state.aa.activeDataFeed);
  const activeAssetRequest = useSelector(state => state.aa.activeAssetRequest);
  const isExpired = useSelector(state => state.aa.isExpired);
  const symbol = useSelector(state => state.aa.symbol);
  const registryToken = useSelector(state => state.deploy.registryToken);
  const regTokenSkip = useSelector(state => state.deploy.regTokenSkip);

  const [address, setAddress] = useState("");
  let screen = "";
  let totalCollateral = 0;
  if (active) {
    for (let asset in activeCoins) {
      if ("collateral" in activeCoins[asset]) {
        if (!("repaid" in activeCoins[asset])) {
          totalCollateral += Number(activeCoins[asset].collateral);
        }
      }
    }
    if (
      !(
        activeDataFeed &&
        activeDataFeed !== "none" &&
        activeDataFeedMa &&
        activeDataFeedMa !== "none"
      )
    ) {
      screen = "data_feed";
    } else if (!("asset" in activeInfo || activeAssetRequest)) {
      screen = "asset";
    } else if ((!symbol && !regTokenSkip) || registryToken) {
      screen = "registryToken";
    } else {
      screen = "home";
    }
  }

  return (
    <Layout title="Discount stablecoins" page="home">
      {!active && (
        <Row style={{ fontSize: 18 }}>
          <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 12 }}>
            <p>
              Issue and redeem <a href="https://medium.com/obyte/introducing-discount-stablecoins-6e7b5e9a8fd6" target="_blank" rel="noopener">discount stablecoins</a>. Or define a new stablecoin
              linked to an asset of your choice.
            </p>
            <p>
              Every stablecoin has guaranteed liquidity after its expiry date,
              exactly at the exchange rate registered on the expiry date.
            </p>
            <p>
              Before the expiry date, stablecoins are freely traded between
              users, and each stablecoin is expected to trade with discount
              relative to its underlying asset. The closer to the expiry, the
              smaller the discount. Buying a stablecoin early (with larger
              discount) and selling later (with smaller discount) allows to earn
              interest.
            </p>
          </Col>
        </Row>
      )}
      <Row style={{ marginBottom: 25 }}>
        <SelectAA autoFocus={true} />
      </Row>

      {screen && screen === "home" && (
        <>
          <Row style={{ marginBottom: 25 }}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              {isExpired ? <ExpiredForm /> : <IssueStablecoinForm />}
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 14, offset: 2 }}>
              <Row type="flex">
                {activeParams && activeParams.expiry_date && (
                  <Col>
                    <div style={{ textAlign: "center", marginRight: 15 }}>
                      {moment
                        .utc()
                        .isSame(
                          moment.utc(activeParams.expiry_date).add(-1, "day"),
                          "day"
                        ) ? (
                        <Countdown
                          title={t("pages.home.statistic.expirationTime")}
                          format={"HH:mm:ss"}
                          value={moment.utc(activeParams.expiry_date)}
                          onFinish={() => dispatch(changeExpiryStatus())}
                        />
                      ) : (
                        <>
                          {moment
                            .utc()
                            .isBefore(moment.utc(activeParams.expiry_date)) ? (
                            <Countdown
                              title={t("pages.home.statistic.expiration")}
                              format={"DD"}
                              value={moment.utc(activeParams.expiry_date)}
                            />
                          ) : (
                            <Statistic
                              title={t("pages.home.statistic.expiration")}
                              value={"Expired"}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </Col>
                )}
                {activeInfo && "circulating_supply" in activeInfo && (
                  <Col>
                    <div style={{ textAlign: "center", marginRight: 15 }}>
                      <Statistic
                        title={
                          symbol
                            ? "Total " + truncate(symbol, { length: 12 })
                            : "Total stablecoins"
                        }
                        value={
                          activeInfo.circulating_supply /
                          10 ** activeParams.decimals
                        }
                      />
                    </div>
                  </Col>
                )}
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <Statistic
                      title="Total collateral"
                      value={totalCollateral / 10 ** 9}
                      suffix={"GB"}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginBottom: 25 }}>
            <WalletForm onChange={address => setAddress(address)} />
            <Row>
              {address && (
                <LoanListByAddress address={address} active={active} />
              )}
            </Row>
          </Row>
        </>
      )}
      {screen && screen === "data_feed" && (
        <Result status="warning" title="The oracle is not responding " />
      )}
      {screen && screen === "asset" && <IssueAsset />}
      {screen && screen === "registryToken" && <RegistryToken />}
    </Layout>
  );
};
