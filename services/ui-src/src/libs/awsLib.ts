import { Storage } from "aws-amplify";
import { S3 } from "aws-sdk";

export async function s3AmplifyUpload(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}

export function s3LocalUploader(s3Client: S3) {
  return async function (file: File) {
    const filename = `${Date.now()}-${file.name}`;

    return new Promise<string>((resolve, reject) => {
      s3Client.putObject(
        {
          Key: filename,
          Body: file,
          //TODO: which bucket/env variable is this to be put to
          Bucket: "",
        },
        (err, _data) => {
          if (err) {
            reject(err);
          }
          resolve(filename);
        }
      );
    });
  };
}

// In Amplify you call get to get a url to the given resource
export async function s3AmplifyGetURL(s3key: string) {
  return Storage.vault.get(s3key);
}

// locally we do what
export function s3LocalGetURL(s3Client: S3) {
  return async function (s3key: string) {
    var params = { Key: s3key };
    return s3Client.getSignedUrl("getObject", params);
  };
}
