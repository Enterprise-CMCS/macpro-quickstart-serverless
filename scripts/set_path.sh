#!/bin/bash

# this is a convenience script for local development
# it puts the top-level node_modules folder in the PATH

TOP_LEVEL_DIR="$(git rev-parse --show-toplevel)"
export PATH=$TOP_LEVEL_DIR/node_modules/.bin:$PATH
