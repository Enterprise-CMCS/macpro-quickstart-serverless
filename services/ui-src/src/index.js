import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import config from "./config";

const client = new ApolloClient({
  uri: "config.apiGraphqlGateway.URL",
  cache: new InMemoryCache(),
});
function Quotes() {
  const { loading, error, data } = useQuery(gql`
    {
      quotes {
        userId
        firstName
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.quotes.map(({ userId, firstName }) => (
    <div key={userId}>
      <p>
        {userId}: {firstName}
      </p>
    </div>
  ));
}

function Querry() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>first graphql query </h2>
        <Quotes />
      </div>
    </ApolloProvider>
  );
}

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
  },
});

ReactDOM.render(
  <Router>
    <App />
    <Querry />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
