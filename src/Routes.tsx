import React from "react";
import { Route, Switch } from "react-router";
import { LandingPage } from "./pages/Landing/LandingPage";
import { FLayout, FMain, FLoader, FContainer } from "ferrum-design-system";
import Header from "./header/header";

const Wrapper = () => {
  return (
    <>
      <Header />
      <FMain>
        <LandingPage />
      </FMain>
    </>
  )
}

const BaseRoutes = () => {
  return (
    <Switch>
      <Route path="/:stakingId" component={
        Wrapper
      }></Route>
    </Switch>
  );
};
export default BaseRoutes;
