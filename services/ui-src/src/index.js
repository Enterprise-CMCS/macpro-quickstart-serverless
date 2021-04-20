import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import config from "./config";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'config.apiGraphqlGateway.URL',
  cache: new InMemoryCache()
});


client
  .query({
    query: gql`
    query {
      quotes {
       userId
       firstName
      }
    }
    `
  })
  .then(result => console.log(result));


  query {
    quotes {
     userId
     firstName
    }
  }




Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
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
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
