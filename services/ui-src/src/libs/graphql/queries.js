import { gql } from "@apollo/client";

export const amendmentsQuery = gql`
  {
    amendments {
      firstName
    }
  }
`;
