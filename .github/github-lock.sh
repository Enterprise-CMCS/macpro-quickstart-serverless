#!/usr/bin/env bash

set -e -o xtrace -o errexit -o pipefail -o nounset -u

########################################################################################
# This is a dumbed down version of circle-lock for github
# A user and api token must be added to github to authenticate calls to the api
# The access token doesn't need any permissions; it's just used to authenticate
########################################################################################

GITHUB_BRANCH=${GITHUB_REF#refs/heads/}

branch=${GITHUB_REF#refs/heads/}
rest=()
github_base_url="api.github.com"
api_url="https://$github_base_url/repos/$GITHUB_REPOSITORY/actions/runs?status=in_progress&branch=$branch"

jq_prog=".workflow_runs | .[] | select(.run_number < $GITHUB_RUN_NUMBER) | .run_number"

echo "Checking for running builds..."

# unset errexit so we can detect and handle temporary github api failures
set +e
consecutive_failures=0
while true;  do
    builds=$(curl -u $GH_USERNAME:$GH_ACCESS_TOKEN --fail --silent --connect-timeout 5 --max-time 10 -H "Accept: application/vnd.github.v3+json" "$api_url" | jq "$jq_prog")


    if [[ $? -ne 0 ]]; then
        echo "Github api call failed"
        consecutive_failures=$(($consecutive_failures + 1))
    elif [[ ! -z ${builds} ]]; then
        # reset failure counter
        consecutive_failures=0

        echo "Waiting on builds:"
        echo "$builds"
    else
        break
    fi

    # limit the number of consecutive failures that we're willing to tolerate
    if [[ ${consecutive_failures} -gt 5 ]]; then
        echo "Failed $consecutive_failures consecutive attempts...giving up"
        exit 1
    fi

    echo "Retrying in 10 seconds..."
    sleep 10
done

echo "Acquired lock"
