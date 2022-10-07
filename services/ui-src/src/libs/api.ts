import { API } from "aws-amplify";
import config from "../config";
import { getLocalUserInfo } from "./user";

interface AmendmentBody {
  email?: string;
  firstName?: string;
  lastName?: string;
  territory?: string;
  urgent?: boolean;
  comments?: any;
  attachment?: any;
}

function requestOptions(): Record<string, any> {
  const localLogin = config.LOCAL_LOGIN === "true";

  if (localLogin) {
    // serverless offline passes the value of the cognito-identity-id into our lambdas as
    // requestContext.identity.cognitoIdentityId. This lets us set a user locally without involving Cognito.
    const currentUser = getLocalUserInfo();
    const options = {
      headers: { "cognito-identity-id": currentUser.username },
    };
    return options;
  } else {
    return {};
  }
}

export function listAmendments() {
  const opts = requestOptions();
  return API.get("amendments", "/amendments", opts);
}

export function getAmendment(id: string) {
  const opts = requestOptions();
  return API.get("amendments", `/amendments/${id}`, opts);
}

export function createAmendment(body: AmendmentBody) {
  const opts = requestOptions();
  opts.body = body;
  return API.post("amendments", "/amendments", opts);
}

export function updateAmendment(id: string, body: AmendmentBody) {
  const opts = requestOptions();
  opts.body = body;
  return API.put("amendments", `/amendments/${id}`, opts);
}

export function deleteAmendment(id: string) {
  const opts = requestOptions();
  return API.del("amendments", `/amendments/${id}`, opts);
}

export function getAccessiblePdf(html: any) {
  const opts = requestOptions();
  opts.body = html;
  return API.post("proxy", `/proxyFunc`, opts);
}
