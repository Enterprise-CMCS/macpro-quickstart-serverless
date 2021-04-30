import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Login.css";
import config from "./../config";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOkta, setIsLoadingOkta] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  function loginWithOkta(event) {
    event.preventDefault();
    setIsLoadingOkta(true);
    try {
      const authConfig = Auth.configure();
      const {
        domain,
        redirectSignIn,
        responseType
      } = authConfig.oauth;
      const clientId = authConfig.userPoolWebClientId;
      const url = `https://${domain}/oauth2/authorize?identity_provider=Okta&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
      window.location.assign(url);
    } catch (e) {
      onError(e);
      setIsLoadingOkta(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Logins">
    <div className="LoginWithOkta"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: '50px',
        }}>
        <form onSubmit={loginWithOkta}>
            <LoaderButton
                style={{
                  background: "#3CB371",
                  color: "#FFFFFF",
                  width: "100%"
                }}
                type="submit"
                bsSize="large"
                isLoading={isLoadingOkta}
            >
                Login with Okta
            </LoaderButton>
        </form>
      </div>
      <form onSubmit={login}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
