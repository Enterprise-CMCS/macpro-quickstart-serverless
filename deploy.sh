#!/bin/bash

set -e

stage=${1:-dev}

services=(
  'database'
  'uploads'
  'app-api'
  'elasticsearch-auth'
  'elasticsearch'
  'stream-functions'
  'ui-auth'
  'ui'
  'ui-src'
)

deploy() {
  service=$1
  pushd services/$service
  npm install
  serverless deploy  --stage $stage
  popd
}

for i in "${services[@]}"
do
	deploy $i
done
