import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Profile.css";
import { Auth } from "aws-amplify"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function Profile() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    useEffect(() => {
        function loadProfile() {
            return Auth.currentUserInfo();
        }

        async function onLoad() {
            try {
                const userInfo = await loadProfile();
                setEmail(userInfo.attributes.email);
                setFirstName(capitalize(userInfo.attributes.given_name));
                setLastName(capitalize(userInfo.attributes.family_name));
                setPhoneNumber(capitalize(userInfo.attributes.phone_number));
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, []);

    function validateForm() {
        return email.length > 0 && firstName.length > 0 && lastName.length;
    }

    function saveProfile(user, userAttributes) {
        return Auth.updateUserAttributes(user, userAttributes);
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setIsLoading(true);
        let user = await Auth.currentAuthenticatedUser();
        try {
            await saveProfile(user, {
                "given_name": firstName,
                "family_name": lastName,
                "phone_number": phoneNumber
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
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        value={email}
                        disabled={true}
                    />
                </FormGroup>
                <FormGroup controlId="firstName">
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="lastName">
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="phoneNumber">
                    <ControlLabel>Phone</ControlLabel>
                    <PhoneInput
                        defaultCountry="US"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e || "")}
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
