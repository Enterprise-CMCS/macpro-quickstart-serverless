import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import config from "./config";
import { loader } from "graphql.macro";
import { fakeAmplifyFetch } from "./api/fakeAmplifyFetch";

const gqlSchema = loader("../../apollo-lambda/graphql/schema.graphql");

const authMode = process.env.REACT_APP_AUTH_MODE;
console.log("zzzAuthMode", authMode);

const link = from([
  new HttpLink({
    uri: "/graphql",
    fetch: fakeAmplifyFetch,
  }),
]);

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
  typeDefs: gqlSchema,
});

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: config.cognito.APP_CLIENT_DOMAIN,
      redirectSignIn: config.cognito.REDIRECT_SIGNIN,
      redirectSignOut: config.cognito.REDIRECT_SIGNOUT,
      scope: ["email", "openid"],
      responseType: "token",
    },
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "amendments",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
      {
        name: "graphql",
        endpoint: config.apiGraphqlGateway.URL,
        region: config.apiGraphqlGateway.REGION,
      },
    ],
    graphql_endpoint: config.apiGraphqlGateway.URL,
    graphql_endpoint_iam_region: config.apiGraphqlGateway.REGION,
  },
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={graphqlClient}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
