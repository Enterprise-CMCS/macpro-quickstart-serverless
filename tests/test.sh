#!/bin/bash

set -e

testcafe "chrome:headless" testcafe/**/*.js --reporter junit:testcafe/testcafe_results/results.json
