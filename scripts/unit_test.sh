#!/bin/bash

# iterates through the list of services defined in this script and:
# - installs dependencies
# - runs unit tests

set -e

services=(
  'ui-src'
)

echo "HEY DID IT WORK ${BUILD_SERVICE_LIST}"

install_deps() {
  if [ "$CI" == "true" ]; then # If we're in a CI system
    if [ ! -d "node_modules" ]; then # If we don't have any node_modules (CircleCI cache miss scenario), run yarn install --frozen-lockfile.  Otherwise, we're all set, do nothing.
      yarn install --frozen-lockfile
    fi
  else # We're not in a CI system, let's yarn install
    yarn install
  fi
}

unit_test() {
  service=$1
  pushd services/$service
  install_deps
  yarn run coverage
  popd
}

# move to the top level directory of the repo
TOP_LEVEL_DIR="$(git rev-parse --show-toplevel)"
cd "$TOP_LEVEL_DIR"

install_deps
export PATH=$(pwd)/node_modules/.bin/:$PATH

for i in "${services[@]}"
do
	unit_test $i
done
