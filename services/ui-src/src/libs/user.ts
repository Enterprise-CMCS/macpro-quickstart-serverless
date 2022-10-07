import { Auth } from "aws-amplify";
import config from "../config";
import { onError } from "./errorLib";

const userKey = "userKey";

export async function updateCurrentUserAttributes(userAttributes: any) {
  const localLogin = config.LOCAL_LOGIN === "true";
  if (localLogin) {
    return updateLocalCurrentUserAttributes(userAttributes);
  } else {
    let user = await Auth.currentAuthenticatedUser();
    return Auth.updateUserAttributes(user, userAttributes);
  }
}

export function updateLocalCurrentUserAttributes(userAttributes: any) {
  const store = window.localStorage;
  var info = JSON.parse(store.getItem(userKey) ?? "");
  info.attributes = { ...info.attributes, ...userAttributes };
  store.setItem(userKey, JSON.stringify(info));
}

export async function currentUserInfo() {
  const localLogin = config.LOCAL_LOGIN === "true";

  if (localLogin) {
    return getLocalUserInfo();
  } else {
    return await getSessionInfo();
  }
}

export function getLocalUserInfo() {
  const store = window.localStorage;

  const info = JSON.parse(store.getItem(userKey) ?? "");

  return info;
}

export async function loginLocalUser(userInfo: any) {
  const store = window.localStorage;

  store.setItem(userKey, JSON.stringify(userInfo));
}

export async function getSessionInfo() {
  try {
    const session = await Auth.currentSession();
    const identityToken = session.getIdToken().decodePayload();
    const accessToken = session.getAccessToken().decodePayload();

    const { email, given_name, family_name, phone_number } = identityToken;
    const { username } = accessToken;

    const userInfo = {
      username: username,
      attributes: {
        email: email,
        given_name: given_name,
        family_name: family_name,
        phone_number: phone_number,
      },
    };

    return userInfo;
  } catch (e) {
    onError(e);
    return {};
  }
}
