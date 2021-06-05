#!/bin/bash

THISDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH=$THISDIR/node_modules/.bin:$PATH
