import React from "react";
import { Route, Switch } from "react-router";
import { LandingPage } from "./pages/Landing/LandingPage";

const BaseRoutes = () => {
  return (
    <Switch>
      <Route path="/:stakingId" component={LandingPage}></Route>
    </Switch>
  );
};
export default BaseRoutes;
