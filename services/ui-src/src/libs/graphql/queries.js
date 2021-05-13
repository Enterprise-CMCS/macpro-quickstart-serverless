import { gql } from "@apollo/client";

export const amendmentsQuery = gql`
  query amendmentsQuery {
    amendments {
      firstName
      lastName
      comments
    }
  }
`;
