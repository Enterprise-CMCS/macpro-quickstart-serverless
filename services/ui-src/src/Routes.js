import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import NewAmendment from "./containers/NewAmendment";
import Amendments from "./containers/Amendments";
import Profile from "./containers/Profile";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

export const routes = [
  {
    component: Home,
    name: "Home",
    path: "/",
    exact: true,
    isAuthenticated: false,
  },
  {
    component: Profile,
    name: "Profile",
    path: "/profile",
    exact: true,
    isAuthenticated: true,
  },
  {
    component: NewAmendment,
    name: "New Amendment",
    path: "/amendments/new",
    exact: true,
    isAuthenticated: true,
  },
  {
    component: Amendments,
    name: "View Amendment",
    path: "/amendments/:id",
    exact: true,
    isAuthenticated: true,
  },
  {
    component: NotFound,
    name: "Not Found",
    isAuthenticated: false,
  },
];

export default function Routes() {
  return (
    <main id="main-wrapper">
      <Switch>
        {routes.map(({ isAuthenticated, name, ...rest }) =>
          isAuthenticated ? (
            <AuthenticatedRoute key={name} {...rest} />
          ) : (
            <Route key={name} {...rest} />
          )
        )}
      </Switch>
    </main>
  );
}
