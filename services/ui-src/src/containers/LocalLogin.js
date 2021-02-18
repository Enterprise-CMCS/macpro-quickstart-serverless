import React from "react";
import { Button } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { loginLocalUser } from "../libs/user"

export default function Login() {
	const { userHasAuthenticated } = useAppContext();

	function loginUser() {
		const alice = {
			username: 'alice',
			attributes: {
				given_name: 'Alice',
				family_name: 'Foo',
				email: 'alice@example.com',
			}
		};
		loginLocalUser(alice);
		userHasAuthenticated(true);
	}


	return (
		<div className="Login">
			<p>Login locally here:</p>
			<Button onClick={ loginUser } >Login as Alice</Button>
		</div>
	);
}