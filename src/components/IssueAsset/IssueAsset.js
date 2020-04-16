import React from "react";
import { Row, Result, Icon } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import config from "../../config";

export const IssueAsset = () => {
  const { t } = useTranslation();
  const active = useSelector(state => state.aa.active);
  const dataString = JSON.stringify({ define: 1 });
  const dataBase64 = btoa(dataString);

  return (
    <Row>
      <Result
        icon={<Icon type="loading" />}
        title={t("components.asset.status.pending.title")}
        extra={
          <a
            className="ant-btn ant-btn-primary"
            href={`obyte${
              config.TESTNET ? "-tn" : ""
            }:${active}?amount=10000&base64data=${encodeURIComponent(dataBase64)}`}
          >
            {t("components.asset.status.pending.button")}
          </a>
        }
      />
    </Row>
  );
};
