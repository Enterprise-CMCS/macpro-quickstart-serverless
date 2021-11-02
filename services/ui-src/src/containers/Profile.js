import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Profile.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { currentUserInfo, updateCurrentUserAttributes } from "../libs/user";
import { capitalize } from "../libs/helpers";

export default function Profile() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function onLoad() {
      try {
        var userInfo = await currentUserInfo();
        setEmail(userInfo.attributes.email);
        setFirstName(capitalize(userInfo.attributes.given_name));
        setLastName(capitalize(userInfo.attributes.family_name));
        setPhoneNumber(
          formatPhoneNumberForForm(userInfo.attributes.phone_number)
        );
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, []);

  function validatePhoneNumber(phone) {
    if (phone === "1" || phone === "") return true;
    return phone.length === 11;
  }
  function validateForm() {
    return (
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length &&
      validatePhoneNumber(phoneNumber)
    );
  }

  function formatPhoneNumberForForm(phone) {
    if (phone == null) return "";
    return phone.replace("+", "");
  }

  function formatPhoneNumberForSubmission(phone) {
    if (phone === "1" || phone === "" || phone == null) return "";
    return "+" + phone.replace("+", "");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await updateCurrentUserAttributes({
        given_name: firstName,
        family_name: lastName,
        phone_number: formatPhoneNumberForSubmission(phoneNumber),
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Profile">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl value={email} disabled={true} />
        </FormGroup>
        <FormGroup controlId="firstName">
          <FormLabel>First Name</FormLabel>
          <FormControl value={firstName} disabled={true} />
        </FormGroup>
        <FormGroup controlId="lastName">
          <FormLabel>Last Name</FormLabel>
          <FormControl value={lastName} disabled={true} />
        </FormGroup>
        <FormGroup controlId="phoneNumber">
          <FormLabel>Phone</FormLabel>
          <PhoneInput
            value={phoneNumber}
            country="us"
            countryCodeEditable={false}
            disableDropdown={true}
            enableAreaCodes={false}
            onChange={(e) => setPhoneNumber(e || "")}
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
          Save
        </LoaderButton>
      </form>
    </div>
  );
}
