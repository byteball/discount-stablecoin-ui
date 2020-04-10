import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Result, Icon, Button } from "antd";

import { Layout } from "../../components/Layout/Layout";
import { DeployForm } from "../../forms";

import { cancelPendingDeployRequest } from "../../store/actions/deploy";
import { useTranslation } from "react-i18next";

export const DeployPage = props => {
  const { t } = useTranslation();
  const pending = useSelector(state => state.deploy.pending);
  const dispatch = useDispatch();

  return (
    <Layout title={t("pages.deploy.title")} page="deploy">
      {!pending ? (
        <DeployForm />
      ) : (
        <Result
          icon={<Icon type="loading" />}
          title={t("pages.deploy.cancel.title")}
          subTitle={t("pages.deploy.cancel.subTitle")}
          extra={
            <Button
              type="danger"
              onClick={() => dispatch(cancelPendingDeployRequest())}
            >
              {t("pages.deploy.cancel.button")}
            </Button>
          }
        />
      )}
    </Layout>
  );
};
