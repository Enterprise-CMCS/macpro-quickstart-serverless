import React from "react";
import { Route, Switch } from "react-router-dom";
import AWS from "aws-sdk";
import Home from "./containers/Home";
import Login from "./containers/Login";
import LocalLogin from "./containers/LocalLogin";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import NewAmendment from "./containers/NewAmendment";
import Amendments from "./containers/Amendments";
import Profile from "./containers/Profile";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import {
  s3AmplifyUpload,
  s3LocalUploader,
  s3AmplifyGetURL,
  s3LocalGetURL,
} from "./libs/awsLib";
import config from "./config";

export default function Routes() {
  // This might not be quite the right place for it, but I'm doing
  // dependency injection here, on the component level.
  // Local Login
  const localLogin = config.LOCAL_LOGIN === "true";

  // Local s3
  const localEndpoint = config.s3.LOCAL_ENDPOINT;
  let s3Upload = s3AmplifyUpload;
  let s3URLResolver = s3AmplifyGetURL;
  if (localLogin && localEndpoint !== "") {
    // Amplify doesn't allow you to configure the AWS Endpoint, so for local dev we need our own S3Client configured.
    let s3Client = new AWS.S3({
      s3ForcePathStyle: true,
      apiVersion: "2006-03-01",
      accessKeyId: "S3RVER", // This specific key is required when working offline
      secretAccessKey: "S3RVER",
      params: { Bucket: config.s3.BUCKET },
      endpoint: new AWS.Endpoint(localEndpoint),
    });
    s3Upload = s3LocalUploader(s3Client);
    s3URLResolver = s3LocalGetURL(s3Client);
  }

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        {localLogin ? <LocalLogin /> : <Login />}
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/profile">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/amendments/new">
        <NewAmendment fileUpload={s3Upload} />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/amendments/:id">
        <Amendments fileUpload={s3Upload} fileURLResolver={s3URLResolver} />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
