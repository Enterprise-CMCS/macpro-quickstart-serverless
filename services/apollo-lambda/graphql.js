const { ApolloServer, gql } = require('apollo-server-lambda');
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });
const getAllAmendments = async () => {
  const params = {
    TableName: process.env.tableName,
  };
  try {
    const results = await client.send(new ScanCommand(params));
    const amendments = [];
    results.Items.forEach((item) => {
      amendments.push(unmarshall(item));
    });
    return amendments;
  } catch (err) {
    console.error(err);
    return err;
  }
};
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
type Amendment{
  amendmentId:  ID!
  authProvider: String
  comments:     String
  email:        string
}
type User {
  userId:    ID!
  firstName: String!
  lastName:  String!
  email:     String!
}

type Query {
  amendments: [Amendment]!
  me: User
}

`;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    amendments: (_, __, { dataSources }) =>
      dataSources.amendmentAPI.getAllAmendments(),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const handler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
exports.graphqlHandler = handler;
