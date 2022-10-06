import AWS from "aws-sdk";
import {
  s3AmplifyUpload,
  s3LocalUploader,
  s3AmplifyGetURL,
  s3LocalGetURL,
} from "./awsLib";
import config from "../config";

const localLogin = config.LOCAL_LOGIN === "true";

// Local s3
const localEndpoint = config.s3.LOCAL_ENDPOINT;
let fileUpload = s3AmplifyUpload;
let fileURLResolver = s3AmplifyGetURL;
if (localLogin && localEndpoint !== "") {
  // Amplify doesn't allow you to configure the AWS Endpoint, so for local dev we need our own S3Client configured.
  let s3Client = new AWS.S3({
    s3ForcePathStyle: true,
    apiVersion: "2006-03-01",
    accessKeyId: "S3RVER", // This specific key is required when working offline   pragma: allowlist secret
    secretAccessKey: "S3RVER", // pragma: allowlist secret
    params: { Bucket: config.s3.BUCKET },
    endpoint: new AWS.Endpoint(localEndpoint),
  });
  fileUpload = s3LocalUploader(s3Client);
  fileURLResolver = s3LocalGetURL(s3Client);
}

export { fileURLResolver, fileUpload };
