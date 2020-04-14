import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "antd/dist/antd.css";
import "./i18n";
import AppRouter from "./AppRouter";
import configureStore from "./store";
import { WatcherUpdate } from "./components/WatcherUpdate/WatcherUpdate";
const { persistor, store } = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <WatcherUpdate>
        <AppRouter />
      </WatcherUpdate>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
