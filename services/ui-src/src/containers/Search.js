import React, { useEffect, useState } from "react";
import { amendmentsQuery } from "../libs/graphql/queries";
import { API } from "aws-amplify";
import { useQuery } from "@apollo/client";

export default function Search() {
  const { data, loading, error } = useQuery(amendmentsQuery);

  let results = [];
  if (data) {
    // Generate output
    for (const datum in data) {
      results.push(<li>{data[datum].firstName}</li>);
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
