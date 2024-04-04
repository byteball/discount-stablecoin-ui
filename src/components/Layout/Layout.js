import React from "react";
import { Layout as LayoutAnt, Spin, Typography } from "antd";
import { useSelector } from "react-redux";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "../Layout/Layout.module.css";

const { Content } = LayoutAnt;
const { Title } = Typography;

export const Layout = ({ children, title, page }) => {
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);

  return (<LayoutAnt className={styles.layout}>
    <Sidebar active={page} />
    <LayoutAnt>
      <Content className={styles.content}>
        {(listByBaseLoaded || page === "about") ? <div className={styles.wrap}>
          <Title level={1}>{title}</Title>
          {children}
        </div> : <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}>
          <div><Spin size="large" /></div>
        </div>}
      </Content>
    </LayoutAnt>
  </LayoutAnt>)
};
