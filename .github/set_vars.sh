#!/bin/bash

branch_specific_vars=(
  'INFRASTRUCTURE_TYPE'
  'ROUTE_53_HOSTED_ZONE_ID'
  'ROUTE_53_DOMAIN_NAME'
  'CLOUDFRONT_CERTIFICATE_ARN'
  'CLOUDFRONT_DOMAIN_NAME'
  'SES_SOURCE_EMAIL_ADDRESS'
  'SES_REVIEW_TEAM_EMAIL_ADDRESS'
  'CTKEY_URL'
  'CTKEY_USERNAME'
  'CTKEY_PASSWORD'
  'CTKEY_ACCOUNT_ID'
  'CTKEY_IAM_ROLE'
  'AWS_ACCESS_KEY_ID'
  'AWS_SECRET_ACCESS_KEY'
  'AWS_DEFAULT_REGION'
)

set_vars_in_set_env_sh() {
  varname=${1}
  # Environment variable names cannot contain hyphens
  # So here we take the branch name, swap hyphens for underscores, and set variables if they exist.
  branch_specific_varname=BRANCH_SPECIFIC_${varname}
  echo $branch_specific_varname
  if [ ! -z "${!branch_specific_varname}" ]; then
    echo """
Environment variable ${branch_specific_varname} has a value.
Setting the value of ${varname} to ${branch_specific_varname}'s value'
    """
    # echo "${varname}=${!branch_specific_varname}" >> set.env.sh
    echo "::set-env name=${branch_specific_varname}::${!branch_specific_varname}"
  elif [ ! -z "${!varname}" ]; then
    echo "Setting $varname default"
    echo "::set-env name=${varname}::${!varname}"
    # echo "${varname}=${!varname}" >> set.env.sh
  fi
}

for i in "${branch_specific_vars[@]}"
do
	set_vars_in_set_env_sh $i
done
# cat set.env.sh
