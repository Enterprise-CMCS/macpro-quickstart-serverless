#!/bin/bash

set -e

docker run --rm --network="data_net" --name test -e APPLICATION_ENDPOINT=http://react -v $(pwd)/testcafe:/tests testcafe/testcafe chromium /tests/**/*.js
