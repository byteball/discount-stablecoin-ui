import React from "react";
import { Router, Route } from "react-router-dom";

import { HomePage, DeployPage, AuctionPage, SearchPage } from "./pages";

import history from "./history";

const AppRouter = () => {
  return (
    <Router history={history}>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/deploy">
        <DeployPage />
      </Route>
      <Route path="/auction">
        <AuctionPage />
      </Route>
      <Route path="/search">
        <SearchPage />
      </Route>
    </Router>
  );
};

export default AppRouter;
