import React from "react";
import ReactDOM from "react-dom";
import ReactGA from 'react-ga';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "antd/dist/antd.css";
import "./i18n";
import AppRouter from "./AppRouter";
import configureStore from "./store";
import config from "./config";

ReactGA.initialize(config.GA_ID);
const { persistor, store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
