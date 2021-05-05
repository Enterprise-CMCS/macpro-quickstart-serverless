import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewAmendment.css";
import { createAmendment } from "../libs/api";
import { currentUserInfo } from "../libs/user";
import Select from "react-select";
import Switch from "react-ios-switch";
import { territoryList } from "../libs/territoryLib";

export default function NewAmendment({ fileUpload }) {
  const file = useRef(null);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [territory, setTerritory] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  async function populateUserInfo() {
    var userInfo = await currentUserInfo();
    setEmail(userInfo.attributes.email);
    setFirstName(capitalize(userInfo.attributes.given_name));
    setLastName(capitalize(userInfo.attributes.family_name));
    return userInfo.attributes.email;
  }

  populateUserInfo();

  function validateForm() {
    return (
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      territory.length > 0
    );
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    var validExt = ".png, .gif, .jpeg, .jpg";
     var filePath = event.value;
     var getFileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
     var pos = validExt.indexOf(getFileExt);
     if(pos < 0) {
       alert("This file is not allowed, please upload valid file.");
       return false;
      } else {
        return true;
      }

    setIsLoading(true);

    try {
      const attachment = file.current ? await fileUpload(file.current) : null;
      await createAmendment({
        email,
        firstName,
        lastName,
        territory,
        urgent,
        comments,
        attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="NewAmendment">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <ControlLabel>Contact Email</ControlLabel>
          <FormControl
            value={email}
            disabled={true}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="firstName">
          <ControlLabel>First Name</ControlLabel>
          <FormControl
            value={firstName}
            disabled={true}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="lastName">
          <ControlLabel>Last Name</ControlLabel>
          <FormControl
            value={lastName}
            disabled={true}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="territory">
          <ControlLabel>State/Territory</ControlLabel>
          <Select
            name="form-field-name"
            value={territoryList.filter(function (option) {
              return option.value === territory;
            })}
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
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <FormGroup controlId="comments">
          <FormControl
            componentClass="textarea"
            placeholder="Additional comments here"
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
          disabled={!validateForm()}
        >
          Submit
        </LoaderButton>
      </form>
    </div>
  );
}
