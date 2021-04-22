#!/bin/bash

set -e

local_branch=${1}

valid_branch_regex="^([a-z])\w+\-+$"


message="There is something wrong with your branch name. Branch names in this project must adhere to this contract: $valid_branch_regex, $local_branch. Your commit will be rejected. You should rename your branch to a valid name and try again."

if [[ ! $local_branch =~ $valid_branch_regex ]]
then
    echo "$message"
    exit 1
fi

exit 0