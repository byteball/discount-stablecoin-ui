import React from "react";
import { Layout, Menu, Icon } from "antd";
import {Link, NavLink} from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../Sidebar/Sidebar.module.css";
import i18n from "../../i18n";
const { Sider } = Layout;

export const Sidebar = ({ active }) => {
  // const aaActive = useSelector(state => state.aa.active);
  const { t } = useTranslation("", { i18n });
  const dataMenu = [
    {
      key: "main",
      icon: "home",
      title: "Main",
      path: "/"
    },
    {
      key: "auction",
      icon: "profile",
      title: t("pages.auction.title"),
      path: `/auction`
    },
    {
      key: "search",
      icon: "search",
      title: "Search",
      path: "/search"
    },
    {
      key: "deploy",
      icon: "plus-circle",
      title: t("pages.deploy.title"),
      path: "/deploy"
    },
    {
      key: "about",
      icon: "info-circle",
      title: "About",
      path: "/about"
    },
  ];
  return (
    <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
      <Link to="/">
        <div className={styles.logo}>
          <img src="/logo.png" className={styles.logo__img} alt="Obyte" />
          <div className={styles.brand}>
            Obyte <div className={styles.product}>Stablecoin</div>
          </div>
        </div>
      </Link>
      <Menu theme="light" defaultSelectedKeys={[active]}>
        {dataMenu.map(item => {
          return (
            <Menu.Item key={item.key}>
              <NavLink to={`/app${item.path}`} activeClassName="selected">
                <Icon type={item.icon} />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};
