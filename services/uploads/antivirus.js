/**
 * Lambda function that will be perform the scan and tag the file accordingly.
 */

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const clamav = require('./clamav');
const s3 = new AWS.S3();
const utils = require('./utils');
const constants = require('./constants');

/**
 * Retrieve the file size of S3 object without downloading.
 * @param {string} key    Key of S3 object
 * @param {string} bucket Bucket of S3 Object
 * @return {int} Length of S3 object in bytes.
 */
async function sizeOf(key, bucket) {
    console.log("key: "+key);
    console.log("bucket: "+bucket);
    var sts = new AWS.STS();
    var params = {
 };
/**
 * Check if S3 object is larger then the MAX_FILE_SIZE set.
 * @param {string} s3ObjectKey       Key of S3 Object
 * @param {string} s3ObjectBucket   Bucket of S3 object
 * @return {boolean} True if S3 object is larger then MAX_FILE_SIZE
 */
async function isS3FileTooBig(s3ObjectKey, s3ObjectBucket)
{
    let fileSize = await sizeOf(s3ObjectKey, s3ObjectBucket);
    return (fileSize > constants.MAX_FILE_SIZE);
}

function downloadFileFromS3(s3ObjectKey, s3ObjectBucket) {
    const downloadDir = `/tmp/download`;
    if (!fs.existsSync(downloadDir)){
        fs.mkdirSync(downloadDir);
    }
    let localPath = `${downloadDir}/${path.basename(s3ObjectKey)}`;

    let writeStream = fs.createWriteStream(localPath);

    utils.generateSystemMessage(`Downloading file s3://${s3ObjectBucket}/${s3ObjectKey}`);

    let options = {
        Bucket: s3ObjectBucket,
        Key   : s3ObjectKey,
    };

    return new Promise((resolve, reject) => {
        s3.getObject(options).createReadStream().on('end', function () {
            utils.generateSystemMessage(`Finished downloading new object ${s3ObjectKey}`);
            resolve();
        }).on('error', function (err) {
            console.log(err);
            reject();
        }).pipe(writeStream);
    });
}


async function lambdaHandleEvent(event, context) {
    utils.generateSystemMessage('Start Antivirus Lambda function');

    let s3ObjectKey = utils.extractKeyFromS3Event(event);
    let s3ObjectBucket = utils.extractBucketFromS3Event(event);

    utils.generateSystemMessage(`S3 Bucket and Key\n ${s3ObjectBucket}\n${s3ObjectKey}`);

    let virusScanStatus;

    //You need to verify that you are not getting too large a file
    //currently lambdas max out at 500MB storage.
    if(await isS3FileTooBig(s3ObjectKey, s3ObjectBucket)){
        virusScanStatus = constants.STATUS_SKIPPED_FILE;
        utils.generateSystemMessage(`S3 File is too big. virusScanStatus=${virusScanStatus}`);
    }
    else{
        //No need to act on file unless you are able to.
        utils.generateSystemMessage('Download AV Definitions');
        await clamav.downloadAVDefinitions(constants.CLAMAV_BUCKET_NAME, constants.PATH_TO_AV_DEFINITIONS);
        utils.generateSystemMessage('Download File from S3');
        await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);
        utils.generateSystemMessage('Set virusScanStatus');
        virusScanStatus = clamav.scanLocalFile(path.basename(s3ObjectKey));
        utils.generateSystemMessage(`virusScanStatus=${virusScanStatus}`);
    }

    var taggingParams = {
        Bucket: s3ObjectBucket,
        Key: s3ObjectKey,
        Tagging: utils.generateTagSet(virusScanStatus)
    };

    try {
        await s3.putObjectTagging(taggingParams).promise();
        utils.generateSystemMessage("Tagging successful");
    } catch(err) {
        console.log(err);
    } finally {
        return virusScanStatus;
    }
}

async function scanS3Object(s3ObjectKey, s3ObjectBucket){
    await clamav.downloadAVDefinitions(constants.CLAMAV_BUCKET_NAME, constants.PATH_TO_AV_DEFINITIONS);

    await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);

    let virusScanStatus = clamav.scanLocalFile(path.basename(s3ObjectKey));

    var taggingParams = {
        Bucket: s3ObjectBucket,
        Key: s3ObjectKey,
        Tagging: utils.generateTagSet(virusScanStatus)
    };

    try {
        await s3.putObjectTagging(taggingParams).promise();
        utils.generateSystemMessage("Tagging successful");
    } catch(err) {
        console.log(err);
    } finally {
        return virusScanStatus;
    }
}

module.exports = {
    lambdaHandleEvent:  lambdaHandleEvent,
    scanS3Object:       scanS3Object,
    isS3FileTooBig:      isS3FileTooBig,
    sizeOf:             sizeOf
};
