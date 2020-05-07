import React from "react";
import { Router, Route } from "react-router-dom";

import {HomePage, DeployPage, AuctionPage, SearchPage, AboutPage, MainPage} from "./pages";

import history from "./history";
import {WatcherUpdate} from "./components/WatcherUpdate/WatcherUpdate";

const AppRouter = () => {
  return (
    <Router history={history}>
      <Route
          path="/app"
          render={({ match: { url } }) => (
              <WatcherUpdate>
                <Route path={`${url}/`} component={MainPage} exact />
                <Route path={`${url}/deploy`} component={DeployPage} />
                <Route path={`${url}/auction`} component={AuctionPage} />
                <Route path={`${url}/search`} component={SearchPage} />
                <Route path={`${url}/about`} component={AboutPage} />
              </WatcherUpdate>
          )}
      />
      <Route path="/" exact component={HomePage} />
    </Router>
  );
};

export default AppRouter;
