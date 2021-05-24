const { ApolloServer } = require("apollo-server-lambda");
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const client = new DynamoDBClient({ region: "us-east-1" });
import typeDefs from "./graphql/schema.graphql";
import { resolvers } from "./graphql/resolvers/resolvers";
import { userFromLocalAuthProvider } from "./auth/localAuth";
import { userFromCognitoAuthProvider } from "./auth/cognitoAuth";

const context = async ({ event }) => {
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  if (authProvider) {
    try {
      const userResult = await userFetcher(authProvider);

      if (!userResult.isErr()) {
        return {
          user: userResult.value,
        };
      } else {
        throw new Error(`Log: failed to fetch user: ${userResult.error}`);
      }
    } catch (err) {
      console.log("Error attempting to fetch user: ", err);
      throw new Error("Log: placing user in gql context failed");
    }
  } else {
    throw new Error("Log: no AuthProvider");
  }
};

const authMode = process.env.LOCAL_LOGIN;

const userFetcher =
  authMode === true ? userFromLocalAuthProvider : userFromCognitoAuthProvider;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
  formatResponse: (response) => {
    console.log(response);
    return response;
  },
  // context: ({ event, context }) => ({
  //   headers: event.headers,
  //   functionName: context.functionName,
  //   event,
  //   context,
  // }),
  context: context,
  playground: {
    endpoint: "/local/graphql",
  },
  tracing: true,
});

const gqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
exports.graphqlHandler = gqlHandler;
