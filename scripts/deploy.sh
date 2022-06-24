#!/bin/bash

# input: a stage name (note that this script appends "-dev" to the provided stage name)
#
# iterates through the list of services defined in this script and:
# - installs dependencies
# - deploys the service to the provided stage
#
# finally, outputs the CloudFront URL of the deployed application

set -e

if [[ $1 == "" ]] ; then
    echo 'ERROR:  You must pass a stage to deploy.  Ex. sh deploy.sh my-stage-name'
    exit 1
fi

stage=${1:-dev}

services=(
  'database'
  'uploads'
  'app-api'
  'proxy-api'
  'stream-functions'
  'ui'
  'ui-auth'
  'ui-src'
)

install_deps() {
  if [ "$CI" == "true" ]; then # If we're in a CI system
    if [ ! -d "node_modules" ]; then # If we don't have any node_modules (CircleCI cache miss scenario), run yarn install --frozen-lockfile.  Otherwise, we're all set, do nothing.
      yarn install --frozen-lockfile
    fi
  else # We're not in a CI system, let's yarn install
    yarn install
  fi
}

deploy() {
  service=$1
  pushd services/$service
  install_deps
  serverless deploy  --stage $stage
  popd
}

install_deps
export PATH=$(pwd)/node_modules/.bin/:$PATH

for i in "${services[@]}"
do
	deploy $i
done

pushd services
echo """
------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
Application endpoint:  `./output.sh ui CloudFrontEndpointUrl $stage`
------------------------------------------------------------------------------------------------
"""
popd
