import React, { useState } from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeActiveAA } from "../../store/actions/aa";
import { createStringDescrForAa, t } from "../../utils";
import styles from "../SelectAA/SelectAA.module.css";
import moment from "moment";
import { ParamsView } from "../ParamsView/ParamsView";
const { Option, OptGroup } = Select;

export const SelectAA = props => {
  const [panelActive, setPanelActive] = useState(null);
  const dispatch = useDispatch();
  const listByBase = useSelector(state => state.aa.listByBase);
  const active = useSelector(state => state.aa.active);
  const loaded = useSelector(state => state.aa.listByBaseLoaded);
  const symbols = useSelector(state => state.symbols);
  const recentActive = listByBase.length > 8;
  const recentStablecoins = useSelector(state => state.recent);
  const handleSelectAA = address => {
    dispatch(changeActiveAA(address));
  };

  const notRecentAaListByBase =
    listByBase &&
    listByBase.filter(
      aaBase =>
        recentStablecoins.find(aa => aa === aaBase.address) === undefined
    );

  const test = notRecentAaListByBase.slice().sort((prev, next) => {
    const prevTime = prev.definition["1"].params.expiry_date;
    const nextTime = next.definition["1"].params.expiry_date;
    return moment.utc(nextTime) - moment.utc(prevTime);
  });
  return (
    <>
      <Select
        className={styles.select}
        placeholder={t("components.selectAA.placeholder")}
        onChange={handleSelectAA}
        value={active || 0}
        size="large"
        loading={!loaded}
        showSearch={true}
        optionFilterProp="children"
        filterOption={(input, option) => {
          const inputData = input.toLowerCase();
          const viewData = String(option.props.children).toLowerCase();
          return viewData.indexOf(inputData) >= 0;
        }}
        {...props}
      >
        <Option key={"AA0"} value={0} disabled>
          {t("components.selectAA.placeholder")}
        </Option>
        {recentActive && recentStablecoins.length >= 1 && (
          <OptGroup label={t("components.selectAA.group.recent")}>
            {recentStablecoins &&
              recentStablecoins.map((address, i) => {
                const aa = listByBase.find(aa => aa.address === address);
                if (aa) {
                  const symbol =
                    aa.address in symbols
                      ? symbols[aa.address].symbol
                      : undefined;
                  const { feed_name, expiry_date } = aa.definition["1"].params;
                  const view = createStringDescrForAa(
                    aa.address,
                    feed_name,
                    expiry_date,
                    symbol
                  );
                  return (
                    <Option
                      key={"AArecent" + i}
                      value={aa.address}
                      view={view}
                      style={{ fontWeight: "regular" }}
                    >
                      {view}
                    </Option>
                  );
                }
                return null;
              })}
          </OptGroup>
        )}
        <OptGroup
          label={
            (recentActive &&
              recentStablecoins.length >= 1 &&
              t("components.selectAA.group.other")) ||
            t("components.selectAA.group.all")
          }
        >
          {test &&
            test.map((aa, i) => {
              const symbol =
                aa.address in symbols ? symbols[aa.address].symbol : undefined;
              const { feed_name, expiry_date } = aa.definition["1"].params;
              const view = createStringDescrForAa(
                aa.address,
                feed_name,
                expiry_date,
                symbol
              );
              return (
                <Option
                  key={"AA" + i}
                  value={aa.address}
                  view={view}
                  style={{ fontWeight: "regular" }}
                >
                  {view}
                </Option>
              );
            })}
        </OptGroup>
      </Select>
      {active && (
        <ParamsView panelActive={panelActive} setPanelActive={setPanelActive} />
      )}
    </>
  );
};
