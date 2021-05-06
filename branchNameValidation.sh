#!/bin/bash

set -e

local_branch=${1}

valid_branch="^[a-z][a-z-0-9-]*$"


if [[ ! $local_branch =~ $valid_branch ]] && [[ $local_branch -gt 128 ]]; then
    echo """
     ------------------------------------------------------------------------------------------------------------------------------
     ERROR:  Please read below
     ------------------------------------------------------------------------------------------------------------------------------
    Bad branch name detected; cannot continue.  $local_branch

    The Serverless Application Framework has a concept of stages that facilitate multiple deployments of the same service.
    In this setup, the git branch name gets passed to Serverless to serve as the stage name.
    The stage name (branch name in this case) is tacked onto the end of the service name by Serverless.
    Therefore, the branch name must be a valid service name. Branch name must be all lower case with no spaces and no underscores.

    From Serverless:
        A service name should only contain alphanumeric (case sensitive) and hyphens. It should start with an alphabetic character and shouldnt exceed 128 characters.
        For Github Actions support, please push your code to a new branch with a name that meets Serverless' service name requirements.
        So, make a new branch with a name that begins with a letter and is made up of only letters, numbers, and hyphens... then delete this branch.
        ------------------------------------------------------------------------------------------------------------------------------
    """
    exit 1
fi

exit 0