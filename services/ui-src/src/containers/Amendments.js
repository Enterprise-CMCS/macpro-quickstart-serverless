import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Amendments.css";
import { s3Upload } from "../libs/awsLib";
import Select from 'react-select';
import Switch from "react-ios-switch";
import { territoryList } from '../libs/territoryLib';


export default function Amendments() {
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
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    useEffect(() => {
        function loadAmendment() {
            return API.get("amendments", `/amendments/${id}`);
        }

        async function onLoad() {
            try {
                const amendment = await loadAmendment();
                const { email, firstName, lastName, territory, transmittalNumber, urgent, comments, attachment } = amendment;
                if (attachment) {
                    amendment.attachmentURL = await Storage.vault.get(attachment);
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
    }, [id]);

    function validateForm() {
        return email.length > 0 && firstName.length > 0 && lastName.length > 0 && territory.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    function saveAmendment(amendment) {
        return API.put("amendments", `/amendments/${id}`, {
            body: amendment
        });
    }

    async function handleSubmit(event) {
        let attachment;

        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${
                    config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            if (file.current) {
                attachment = await s3Upload(file.current);
            }
            await saveAmendment({
                email,
                firstName,
                lastName,
                territory,
                transmittalNumber,
                urgent,
                comments,
                attachment: attachment || amendment.attachment
            });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteAmendment() {
        return API.del("amendments", `/amendments/${id}`);
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
            await deleteAmendment();
            history.push("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
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
                            onChange={e => setTransmittalNumber(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="name">
                        <ControlLabel>Submitter</ControlLabel>
                        <FormControl
                            value={firstName + ' ' + lastName}
                            disabled={true}
                        />
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
                            onChange={e => setEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="territory">
                        <ControlLabel>State/Territory</ControlLabel>
                        <Select
                            name="form-field-name"
                            value={territoryList.filter(function(option) {
                                return option.value === territory;
                            })}
                            isDisabled={true}
                            onChange={e => setTerritory(e.value)}
                            options={territoryList}
                        />
                    </FormGroup>
                    <FormGroup controlId="urgent">
                        <ControlLabel>This APS is classified as urgent &nbsp;</ControlLabel>
                        <Switch controlId="urgent"
                                checked={urgent}
                                onChange={e => setUrgent(!urgent)}
                        />
                    </FormGroup>
                    {amendment.attachment && (
                        <FormGroup>
                            <ControlLabel>Attachment</ControlLabel>
                            <FormControl.Static>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={amendment.attachmentURL}
                                >
                                    {formatFilename(amendment.attachment)}
                                </a>
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
                            onChange={e => setComments(e.target.value)}
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
                    <LoaderButton
                        block
                        bsSize="large"
                        bsStyle="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </LoaderButton>
                </form>
            )}
        </div>
    );
}
