import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";
import { getAmendment, listAmendments } from "../../../ui-src/src/libs/api";

export function resolvers() {
  const resolvers = {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    Query: {
      amendments: async (root, args) => listAmendments(),
      amendment: async (root, args) => getAmendment(args),
    },
  };

  return resolvers;
}
