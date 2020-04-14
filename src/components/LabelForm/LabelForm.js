import { Icon, Tooltip } from "antd";
import React from "react";

import styles from "./LabelForm.module.css";
import { t } from "../../utils";

export const LabelForm = ({ field, tooltip = false, page }) => (
  <span className={styles.LabelForm}>
    {tooltip && (
      <Tooltip title={t(`forms.${page}.fields.${field}.descr`)} placement="top">
        <Icon type="info-circle" className={styles.icon} />
      </Tooltip>
    )}{" "}
    {t(`forms.${page}.fields.${field}.name`)}:
  </span>
);
