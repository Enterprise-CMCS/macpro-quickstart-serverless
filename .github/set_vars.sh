#!/bin/bash

var_list=(
  'AWS_ACCESS_KEY_ID'
  'AWS_SECRET_ACCESS_KEY'
  'AWS_DEFAULT_REGION'
  'CTKEY_URL'
  'CTKEY_USERNAME'
  'CTKEY_PASSWORD'
  'CTKEY_ACCOUNT_ID'
  'CTKEY_IAM_ROLE'
  'INFRASTRUCTURE_TYPE'
  'SES_SOURCE_EMAIL_ADDRESS'
  'SES_REVIEW_TEAM_EMAIL_ADDRESS'
  'ROUTE_53_HOSTED_ZONE_ID'
  'ROUTE_53_DOMAIN_NAME'
  'CLOUDFRONT_CERTIFICATE_ARN'
  'CLOUDFRONT_DOMAIN_NAME'
  'IAM_PATH'
  'IAM_PERMISSIONS_BOUNDARY_POLICY'
)

set_vars_for_all_steps() {
  varname=${1}
  if [ ! -z "${!varname}" ]; then
    echo "Setting $varname default"
    echo "::set-env name=${varname}::${!varname}"
  fi
}

for i in "${var_list[@]}"
do
	set_vars_for_all_steps $i
done
