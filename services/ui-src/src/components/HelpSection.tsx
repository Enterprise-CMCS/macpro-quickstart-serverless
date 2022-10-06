import React from "react";
import * as Bootstrap from "react-bootstrap";
import { helpDeskContact, qualityContact } from "../libs/contacts";

export function HelpSection() {
  return (
    <Bootstrap.Container className="mb-4">
      <h3>Do you have questions or need support?</h3>
      <div className="footer-fed-gov-text">
        For technical questions regarding use of this application, please reach
        out to{" "}
        <a href={`mailto:${helpDeskContact.email}`}>{helpDeskContact.email}</a>.
        For content-related questions, such as about measure specifications or
        what information to enter in each field, please reach out to{" "}
        <a href={`mailto:${qualityContact.email}`}>{qualityContact.email}</a>
      </div>
    </Bootstrap.Container>
  );
}
