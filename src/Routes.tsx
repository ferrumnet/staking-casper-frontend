import React from "react";
import { Route, Switch } from "react-router";
import { LandingPage } from "./pages/Landing/Landing";
import AdminDashboard from "./pages/Admin/admin";

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

const Admin = () => {
  return (
    <>
      <Header />
      <FMain>
        <AdminDashboard />
      </FMain>
    </>
  )
}


const BaseRoutes = () => {
  return (
    <Switch>
      <Route path="/admin" component={
        AdminDashboard
      }></Route>
      <Route path="/:stakingId" component={
        Wrapper
      }></Route>
      
    </Switch>
  );
};
export default BaseRoutes;
