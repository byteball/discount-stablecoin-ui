import React from "react";
import { Layout as LayoutAnt, Typography } from "antd";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "../Layout/Layout.module.css";

const { Content } = LayoutAnt;
const { Title } = Typography;

export const Layout = ({ children, title, page }) => (
  <LayoutAnt className={styles.layout}>
    <Sidebar active={page} />
    <LayoutAnt>
      <Content className={styles.content}>
        <div className={styles.wrap}>
          <Title level={1}>{title}</Title>
          {children}
        </div>
      </Content>
    </LayoutAnt>
  </LayoutAnt>
);
