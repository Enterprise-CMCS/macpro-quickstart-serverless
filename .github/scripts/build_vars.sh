#!/bin/bash

var_list=(
  'AWS_OIDC_ROLE_TO_ASSUME'
  'AWS_DEFAULT_REGION'
  'STAGE_PREFIX'
  'SLACK_WEBHOOK_URL'
  'CODE_CLIMATE_ID'
)

services=(
  'database'
  'uploads'
  'app-api'
  'proxy-api'
  'stream-functions'
  'ui'
  'ui-auth'
  'ui-src'
)

set_service_list() {
  serviceList=()
  allFlag=false;

  for i in ${GIT_DIFF}; do 
      serviceFound=false;
      for j in "${services[@]}" ; do
          if [[ "$i" == *"services/${j}/"* ]]; then
              serviceList+=($j);
              serviceFound=true;
          fi
      done
      if [[ $serviceFound == false ]]; then 
          allFlag=true;
      fi
  done

  if [[ $allFlag == true || ! ((${GIT_DIFF[@]})) ]]; then
      serviceList=(${services[@]})
  fi

  uniquesPrep=()
  for l in "${services[@]}" ; do  
    for k in "${serviceList[@]}" ; do
      if [[ "$k" == "$l"]]
        uniquesPrep+="$l";
    done
  done

  uniques=($(for v in "${uniquesPrep[@]}"; do echo "$v";done| uniq| xargs))
  echo "Setting service list to build: ${uniques[@]}"
  echo "BUILD_SERVICE_LIST=${uniques[@]}" >> $GITHUB_ENV
}

set_value() {
  varname=${1}
  if [ ! -z "${!varname}" ]; then
    echo "Setting $varname"
    echo "${varname}=${!varname}" >> $GITHUB_ENV
  fi
}

set_name() {
  varname=${1}
  echo "BRANCH_SPECIFIC_VARNAME_$varname=${branch_name//-/_}_$varname" >> $GITHUB_ENV
}

action=${1}

case "$1" in
set_names)
  for i in "${var_list[@]}"
  do
    set_name $i
  done
  ;;
set_values)
  for i in "${var_list[@]}"
  do
  	set_value $i
  done
  ;;
set_service_list)
  set_service_list
  ;;
esac
