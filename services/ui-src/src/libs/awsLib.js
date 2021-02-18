import { Storage } from "aws-amplify";

export async function s3AmplifyUpload(file) {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type,
    });

    return stored.key;
}

export function s3LocalUploader(s3Client) {
	return async function(file){
        const filename = `${Date.now()}-${file.name}`;

        return new Promise((resolve, reject) => {
            s3Client.putObject({
                Key: filename,
                Body: file,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(filename)
            } );
        })
	}
}

// In Amplify you call get to get a url to the given resource
export async function s3AmplifyGetURL(s3key) {
    return Storage.vault.get(s3key);
}

// locally we do what
export function s3LocalGetURL(s3Client) {
    return function(s3key) {
        var params = { Key: s3key };
        return s3Client.getSignedUrl('getObject', params);
    }
}