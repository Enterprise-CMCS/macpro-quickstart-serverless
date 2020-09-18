#!/bin/bash

set -e

stage=${1:-dev}

# Clean up existing, non-empty buckets
pushd services
ui_bucket_name=`./output.sh ui S3BucketName $stage`
aws s3 rm s3://$ui_bucket_name --recursive
uploads_bucket_name=`./output.sh uploads AttachmentsBucketName $stage`
aws s3 rm s3://$uploads_bucket_name --recursive
popd

services=(
  'database'
  'uploads'
  'app-api'
  'elasticsearch-auth'
  'elasticsearch'
  'stream-functions'
  'ui'
  'ui-auth'
  # Running remove on ui-src would delete the s3 bucket and cause remove on ui to fail.
  # We empty the bucket near the top of this file, and allow ui to delete it
  # 'ui-src'
)

deploy() {
  service=$1
  pushd services/$service
  npm install
  serverless remove --stage $stage
  popd
}

for (( idx=${#services[@]}-1 ; idx>=0 ; idx-- )) ; do
    deploy ${services[idx]}
done
