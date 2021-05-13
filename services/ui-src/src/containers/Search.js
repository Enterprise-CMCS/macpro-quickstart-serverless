import React, { useEffect, useState } from "react";
import { amendmentsQuery } from "../libs/graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

export default function Search() {
  const [amendments, setAmendments] = useState();

  useEffect(() => {
    fetchAmendments();
  });

  // Get all amendments
  async function fetchAmendments() {
    const apiData = await API.graphql({
      query: amendmentsQuery,
      authMode: "AWS_IAM",
    });

    setAmendments(apiData.data);
  }

  let results = [];
  if (amendments) {
    // Generate output
    for (const amendment in amendments) {
      results.push(<li>{amendments[amendment].firstName}</li>);
    }
  }

  return (
    <div className="Search">
      <h1>Search</h1>
      {console.log("zzzResults", results)}
      {/*{loading ? <h1>Loading</h1> : null}*/}
      {/*{error ? error : null}*/}
      {results ?? "No Results found"}
    </div>
  );
}
