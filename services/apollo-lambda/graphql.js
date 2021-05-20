const { ApolloServer } = require("apollo-server-lambda");
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const client = new DynamoDBClient({ region: "us-east-1" });
import typeDefs from "./graphql/schema.graphql";
import { resolvers } from "../resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const gqlHandler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
exports.graphqlHandler = gqlHandler;
