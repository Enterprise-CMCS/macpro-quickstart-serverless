import React from "react";
import { Route, Switch } from "react-router-dom";
import AWS from "aws-sdk";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import NewAmendment from "./containers/NewAmendment";
import Amendments from "./containers/Amendments";
import Profile from "./containers/Profile";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import {
  s3AmplifyUpload,
  s3LocalUploader,
  s3AmplifyGetURL,
  s3LocalGetURL,
} from "./libs/awsLib";
import config from "./config";

// Local Login
const localLogin = config.LOCAL_LOGIN === "true";
// Local s3
const localEndpoint = config.s3.LOCAL_ENDPOINT;

const isLocal = localLogin && localEndpoint;

if (isLocal) {
  var s3Client = new AWS.S3({
    s3ForcePathStyle: true,
    apiVersion: "2006-03-01",
    accessKeyId: "S3RVER", // This specific key is required when working offline   pragma: allowlist secret
    secretAccessKey: "S3RVER", // pragma: allowlist secret
    params: { Bucket: config.s3.BUCKET },
    endpoint: new AWS.Endpoint(localEndpoint),
  });
}

const fileUpload = isLocal ? s3AmplifyUpload : s3LocalUploader(s3Client);
const fileURLResolver = isLocal ? s3AmplifyGetURL : s3LocalGetURL(s3Client);

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
    fileUpload,
  },
  {
    component: Amendments,
    name: "View Amendment",
    path: "/amendments/:id",
    exact: true,
    isAuthenticated: true,
    fileUpload,
    fileURLResolver,
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
