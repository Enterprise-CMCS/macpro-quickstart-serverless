import React, { useState, useEffect } from "react";
import { Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { PageHeader } from "../components/PageHeader";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { listAmendments } from "../libs/api";
import { LinkContainer } from "react-router-bootstrap";

export default function Home() {
  const [amendments, setAmendments] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const amendments = await loadAmendments();
        setAmendments(amendments);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadAmendments() {
    return listAmendments();
  }

  function renderAmendmentsList(amendments) {
    return [{}].concat(amendments).map((amendment, i) =>
      i !== 0 ? (
        <LinkContainer
          key={amendment.amendmentId}
          to={`/amendments/${amendment.amendmentId}`}
        >
          <ListGroupItem
            header={amendment.transmittalNumber.trim().split("\n")[0]}
          >
            {"Created: " + new Date(amendment.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/amendments/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Submit New APS
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>APS Submission App</h1>
        <p>
          ACME's Amendment to Planned Settlement (APS) submission application
        </p>
      </div>
    );
  }

  function renderAmendments() {
    return (
      <div className="amendments">
        <PageHeader>Your Demo APS Submissions</PageHeader>
        <ListGroup>{!isLoading && renderAmendmentsList(amendments)}</ListGroup>
      </div>
    );
  }

  return (
    <Container data-testid="Home-Container">
      <Breadcrumbs />
      {isAuthenticated ? renderAmendments() : renderLander()}
    </Container>
  );
}
