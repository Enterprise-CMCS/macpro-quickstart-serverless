#!/bin/bash

set -e

#testcafe "chrome:headless" testcafe/**/*.js --reporter json:testcafe/testcafe_results/results.json
npm test
