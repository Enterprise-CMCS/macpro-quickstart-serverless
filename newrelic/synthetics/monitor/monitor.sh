#!/bin/bash

# API key from your account settings
API_KEY='NRAK-043OA67JOXYCYOD5EUL8DJFZB2M'
# Other attributes found at https://docs.newrelic.com/docs/apis/synthetics-rest-api/monitor-examples/attributes-synthetics-rest-api#api-attributes
monitorName='Ish-Test-API-Script'
monitorType='SCRIPT_BROWSER'
frequency=1440
locations='"AWS_US_WEST_1", "AWS_US_EAST_1"'
slaThreshold=7.0
# Location of the file with your script
scriptfile=sample_synth_script.js

# Test that the script file exists (does not validate content)
if [ -e "$scriptfile" ]
then
  script=$(cat "$scriptfile")

  payload="{  \"name\" : \"$monitorName\", \"frequency\" : $frequency,    \"locations\" : [ $locations ],   \"status\" : \"ENABLED\",  \"type\" : \"$monitorType\", \"slaThreshold\" : $slaThreshold, \"uri\":\"\"}"
  echo "Creating monitor"

  # Make cURL call to API and parse response headers to get monitor UUID
  shopt -s extglob # Required to trim whitespace; see below
  while IFS=':' read key value; do
    # trim whitespace in "value"
    value=${value##+([[:space:]])}; value=${value%%+([[:space:]])}
    case "$key" in
        location) LOCATION="$value"
                ;;
        HTTP*) read PROTO STATUS MSG <<< "$key{$value:+:$value}"
                ;;
    esac
  done < <(curl -sS -i  -X POST -H "Api-Key:$API_KEY" -H 'Content-Type:application/json' https://synthetics.newrelic.com/synthetics/api/v3/monitors -d "$payload")

  # Validate monitor creation & add script unless it failed
  if [ $STATUS = 201 ]; then
    echo "Monitor created, $LOCATION "
    echo "Uploading script"
      # base64 encode script
      encoded=`echo "$script" | base64 -w 0`
      scriptPayload="{\"scriptText\":\"$encoded\"}"
        curl -s -X PUT -H "Api-Key:$API_KEY" -H 'Content-Type:application/json' "$LOCATION/script" -d $scriptPayload
        echo "Script uploaded"
  else
    echo "Monitor creation failed"
  fi

else
  echo "script file not found, not creating monitor"
fi
