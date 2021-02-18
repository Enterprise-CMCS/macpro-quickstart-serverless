import { Auth } from "aws-amplify"
import config from '../config';

const userKey = 'userKey';

export async function currentUserInfo() {
	const localLogin = config.LOCAL_LOGIN === 'true';

	if (localLogin) {
		return getLocalUserInfo();
	} else {
		return Auth.currentUserInfo();
	}
}

export function getLocalUserInfo() {
	const store = window.localStorage;

	const info = JSON.parse(store.getItem(userKey))

	return info;
}

export async function loginLocalUser(userInfo) {
	const store = window.localStorage;

	store.setItem(userKey, JSON.stringify(userInfo))
}