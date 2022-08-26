#!/bin/bash

# input: a stage name (note that this script appends "-dev" to the provided stage name)
#
# iterates through the list of services defined in this script and:
# - verifies the IamRoleLambdaExecution.RoleName is less than 65 characters
# - RoleName is composed like this:
#   {service}-{stage}-{function}-{region}-lambdaRole per https://github.com/functionalone/serverless-iam-roles-per-function#role-names
#   Assumptions about RoleName:
#   region is 9 characters (us-east-1)
#   MAXLENGTH = 64 - {region}
#   restrict the length of {service} + {stage} + {function} <= MAXLENGTH
#
#
# after service+stage+function names have been validated:
#   iterates through the list of services defined in this script and:
#   - installs dependencies
#   - deploys the service to the provided stage
#
# finally, outputs the CloudFront URL of the deployed application

set -e

if [[ $1 == "" ]]; then
    echo 'ERROR:  You must pass a stage to deploy.  Ex. sh deploy.sh my-stage-name'
    exit 1
fi

stage=${1:-dev}
valid_stage="^[a-z][a-z0-9-]*$"
MAXLENGTH=55

if [[ ! $1 =~ $valid_stage ]]; then
    echo "ERROR: stage name is not a valid name. It must match the pattern ${valid_stage}"
    exit 1
fi;

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

if [[ ((${BUILD_SERVICE_LIST[@]})) ]]; then 
  services=($BUILD_SERVICE_LIST)
fi

getMaxFuncName() {
  longestFuncName=""
  maxFuncLen=0
  for file in *
  do
    funcName=$(echo "$file" | cut -d '.' -f1)
    if [[ ${#funcName} -gt ${maxFuncLen} ]]; then
      maxFuncLen=${#funcName}
      longestFuncName=${funcName}
    fi
  done
  echo "${longestFuncName}"
}

checkStageServiceFunctionLength() {
  for i in "${services[@]}"
  do
    if find "./services/${i}" -maxdepth 1 -type d | grep -q handlers; then
      funcName=$(cd "./services/${i}/handlers"; getMaxFuncName)
    fi
    if [[ $((${#stage} + ${#i} + ${#funcName})) -gt ${MAXLENGTH} ]]; then
      if [[ ${#funcName} -gt 0 ]]
      then
        echo "ERROR: length of stage ${stage} (${#stage}) + service ${i} (${#i}) + function ${funcName} (${#funcName}) exceeds ${MAXLENGTH} characters"
        exit 1
      else
        echo "ERROR: length of stage ${stage} (${#stage}) + service ${i} (${#i}) exceeds ${MAXLENGTH} characters"
        exit 1
      fi
    fi
  done
}

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
  pushd services/"$service"
  install_deps
  serverless deploy  --stage "$stage"
  popd
}

checkStageServiceFunctionLength

install_deps
export PATH=$(pwd)/node_modules/.bin/:$PATH

for i in "${services[@]}"
do
	deploy "$i"
done

pushd services
echo """

------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
Application endpoint:  $(./output.sh ui CloudFrontEndpointUrl "$stage")
------------------------------------------------------------------------------------------------
"""
popd
