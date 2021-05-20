import { GraphQLDate, GraphQLDateTime } from "graphql-scalars";

export function resolvers() {
  const resolvers = {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    Query: {
      amendments: async (parent, args, context) => {
        return context.amendments;
      },
    },
    Amendment: {
      amendment: (parent, args, context) => {
        return { firstName: context.firstName, lastName: context.lastName };
      },
    },
  };
  return resolvers;
}
