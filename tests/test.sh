#!/bin/bash

set -e

#testcafe "chrome:headless" testcafe/**/*.js --reporter json:testcafe/testcafe_results/results.json
cd nightwatch-test && npm install chromedriver --save-dev && npm test
