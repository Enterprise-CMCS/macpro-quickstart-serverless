import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Amendments.css";
import Select from "react-select";
import Switch from "react-ios-switch";
import { territoryList } from "../libs/territoryLib";
import * as url from "url";
import ReactDOMServer from "react-dom/server";
import {
  getAmendment,
  updateAmendment,
  deleteAmendment,
  getAccessiblePdf,
} from "../libs/api";
import {
  capitalize,
  validateAmendmentForm,
  validateFileAttachment,
} from "../libs/helpers";

export default function Amendments({ fileUpload, fileURLResolver }) {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [amendment, setAmendment] = useState(null);
  const [transmittalNumber, setTransmittalNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [territory, setTerritory] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadAmendment() {
      return getAmendment(id);
    }

    async function onLoad() {
      try {
        const amendment = await loadAmendment();
        const {
          email,
          firstName,
          lastName,
          territory,
          transmittalNumber,
          urgent,
          comments,
          attachment,
        } = amendment;
        if (attachment) {
          console.log(fileURLResolver);
          // We must await the url.  Otherwise, the attachmentURL is a Promise.
          amendment.attachmentURL = await fileURLResolver(attachment);
        }
        setEmail(email);
        setFirstName(capitalize(firstName));
        setLastName(capitalize(lastName));
        setTerritory(territory);
        setTransmittalNumber(transmittalNumber);
        setUrgent(urgent);
        setComments(comments);
        setAmendment(amendment);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id, fileURLResolver]);

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveAmendment(amendment) {
    return updateAmendment(id, amendment);
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (!validateFileAttachment(file)) return;

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await fileUpload(file.current);
      }
      await saveAmendment({
        email,
        firstName,
        lastName,
        territory,
        transmittalNumber,
        urgent,
        comments,
        attachment: attachment || amendment.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  // async function handlePrint(event) {
  //   event.preventDefault();
  //   window.print();
  // };

  const openPdf = (basePdf) => {
    let byteCharacters = atob(basePdf);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], { type: "application/pdf;base64" });
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  async function handlePrintAccessiblePdf(event) {
    event.preventDefault();
    // let html = document.querySelector("html").innerHTML;
    let html = printableHtml();
    console.log(html);
    const pdf = await getAccessiblePdf(btoa(html));
    openPdf(pdf);
  }

  function printableHtml() {
    return ReactDOMServer.renderToStaticMarkup(
      <html lang="en">
        <head>
          <title>APS print page</title>
        </head>
        <body>
          <img
            alt="SC state logo"
            src="https://i.pinimg.com/originals/c4/52/04/c4520440b727695b5aca89e7afa2e7e3.jpg"
            width="50"
          />
          <p style={{ "border-top": "1px solid black" }}>&nbsp;</p>
          <h1>Amendment to Planned Settlement (APS)</h1>
          <p>&nbsp;</p>
          <p>APD-ID:&nbsp;&nbsp;{transmittalNumber}</p>
          <p>Submitter:&nbsp;&nbsp;{firstName + " " + lastName}</p>
          <p>Submitter Email:&nbsp;&nbsp;{email}</p>
          <p>Urgent?:&nbsp;&nbsp;{urgent.toString()}</p>
          <p>Comments:&nbsp;&nbsp;{comments}</p>
        </body>
      </html>
    );
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this amendment?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAmendment(id);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function openAttachment(event, attachmentURL) {
    event.preventDefault();
    var http = require("http");
    const uri = url.parse(attachmentURL);
    var options = {
      hostname: uri.hostname,
      port: uri.port,
      path: `${uri.pathname}${uri.search}`,
      protocol: uri.protocol,
      method: "GET",
    };
    var req = http.request(options, function (res) {
      req.abort(); // The presigned S3 URL is only valid for GET requests, but we only want the headers.
      if (res.statusCode.toString() === "403") {
        window.open(
          process.env.PUBLIC_URL + "/scan-in-progress.html",
          "_blank"
        );
      } else {
        window.open(attachmentURL, "_blank");
      }
    });
    req.end();
  }

  return (
    <div className="Amendments">
      {amendment && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="transmittalNumber">
            <ControlLabel>APS ID &nbsp;(Transmittal Number)</ControlLabel>
            <FormControl
              disabled={true}
              value={transmittalNumber}
              onChange={(e) => setTransmittalNumber(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="name">
            <ControlLabel>Submitter</ControlLabel>
            <FormControl value={firstName + " " + lastName} disabled={true} />
          </FormGroup>
          {/*<FormGroup controlId="firstName">*/}
          {/*    <ControlLabel>First Name</ControlLabel>*/}
          {/*    <FormControl*/}
          {/*        value={firstName}*/}
          {/*        disabled={true}*/}
          {/*        onChange={e => setFirstName(e.target.value)}*/}
          {/*    />*/}
          {/*</FormGroup>*/}
          {/*<FormGroup controlId="lastName">*/}
          {/*    <ControlLabel>Last Name</ControlLabel>*/}
          {/*    <FormControl*/}
          {/*        value={lastName}*/}
          {/*        disabled={true}*/}
          {/*        onChange={e => setLastName(e.target.value)}*/}
          {/*    />*/}
          {/*</FormGroup>*/}
          <FormGroup controlId="email">
            <ControlLabel>Submitter Email</ControlLabel>
            <FormControl
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="territory">
            <ControlLabel>State/Territory</ControlLabel>
            <Select
              name="form-field-name"
              value={territoryList.filter(function (option) {
                return option.value === territory;
              })}
              isDisabled={true}
              onChange={(e) => setTerritory(e.value)}
              options={territoryList}
            />
          </FormGroup>
          <FormGroup controlId="urgent">
            <ControlLabel>This APS is classified as urgent &nbsp;</ControlLabel>
            <Switch
              controlId="urgent"
              checked={urgent}
              onChange={(e) => setUrgent(!urgent)}
            />
          </FormGroup>
          {amendment.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <button
                  className="link-lookalike"
                  onClick={(e) => openAttachment(e, amendment.attachmentURL)}
                >
                  {formatFilename(amendment.attachment)}
                </button>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!amendment.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <FormGroup controlId="comments">
            <ControlLabel>Additional Comments</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={
              !validateAmendmentForm(email, firstName, lastName, territory)
            }
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
          <LoaderButton block bsSize="large" onClick={handlePrintAccessiblePdf}>
            Print
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
