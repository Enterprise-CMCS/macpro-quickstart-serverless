#!/bin/bash

set -e

testcafe "chrome:headless" testcafe/**/*.js
