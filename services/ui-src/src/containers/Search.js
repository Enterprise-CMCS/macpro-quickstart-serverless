import React from "react";
import { gql, useQuery } from "@apollo/client";

export default function Search() {
  // Query for amendments
  const amendmentsQuery = gql`
    query amendmentsQuery {
      amendments {
        firstName
        lastName
        comments
      }
    }
  `;

  // Make query against database
  const { loading, error, data } = useQuery(amendmentsQuery);

  let results = [];
  if (data) {
    let amendments = data.amendments;

    // Generate output
    for (const amendment in amendments) {
      results.push(
        <li>
          {amendments[amendment].firstName}: {amendments[amendment].comments}
        </li>
      );
    }
  }

  return (
    <div className="Search">
      <h1>Search</h1>
      {loading ? <h1>Loading</h1> : null}
      {error ? error : null}
      {results ?? null}
    </div>
  );
}
