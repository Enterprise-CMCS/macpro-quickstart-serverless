#!/bin/bash
set -e

if [[ $1 == "" ]] ; then
    echo 'ERROR:  You must pass a stage to destroy.  Ex. sh destroy.sh my-stage-name'
    exit 1
fi
stage=$1

# A list of protected/important branches/environments/stages.
protected_stage_regex="(^master$|^val$|^production)"
if [[ $stage =~ $protected_stage_regex ]] ; then
    echo """
      ---------------------------------------------------------------------------------------------
      ERROR:  Please read below
      ---------------------------------------------------------------------------------------------
      The regex used to denote protected stages matched the stage name you passed.
      The regex holds names commonly used for important branches/environments/stages.
      This indicates you're trying to destroy a stage that you likely don't really want to destroy.
      Out of caution, this script will not continue.

      If you really do want to destroy $stage, modify this script as necessary and run again.

      Be careful.
      ---------------------------------------------------------------------------------------------
    """
    exit 1
fi
echo "\nCollecting information on stage $stage before attempting a destroy... This can take a minute or two..."

set -e

# Find cloudformation stacks associated with stage
stackList=(`aws cloudformation describe-stacks | jq -r ".Stacks[] | select(.Tags[] | select(.Key==\"STAGE\") | select(.Value==\"$stage\")) | .StackName"`)

# Find buckets attached to any of the stages, so we can empty them before removal.
bucketList=()
set +e
for i in "${stackList[@]}"
do
  buckets=(`aws cloudformation list-stack-resources --stack-name $i | jq -r ".StackResourceSummaries[] | select(.ResourceType==\"AWS::S3::Bucket\") | .PhysicalResourceId"`)
  for j in "${buckets[@]}"
  do
    # Sometimes a bucket has been deleted outside of CloudFormation; here we check that it exists.
    if aws s3api head-bucket --bucket $j > /dev/null 2>&1; then
      bucketList+=($j)
    fi
  done
done

echo """
********************************************************************************
- Check the following carefully -
********************************************************************************
"""

echo "The following buckets will be emptied"
printf '%s\n' "${bucketList[@]}"

echo "The following stacks will be destroyed:"
printf '%s\n' "${stackList[@]}"

echo """
********************************************************************************
- Scroll up and check carefully -
********************************************************************************
"""
if [ "$CI" != "true" ]; then
  read -p "Do you wish to continue?  Re-enter the stage name to continue:  " -r
  echo
  if [[ ! $REPLY == "$stage" ]]
  then
      echo "Stage name not re-entered.  Doing nothing and exiting."
      exit 1
  fi
fi

for i in "${bucketList[@]}"
do
  echo $i
  set -e

  # Suspend bucket versioning.
  aws s3api put-bucket-versioning --bucket $i --versioning-configuration Status=Suspended

  # Remove all bucket versions.
  versions=`aws s3api list-object-versions \
    --bucket "$i" \
    --output=json \
    --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}'`
  if ! echo $versions | grep -q '"Objects": null'; then
    aws s3api delete-objects \
      --bucket $i \
      --delete "$versions" > /dev/null 2>&1
  fi

  # Remove all bucket delete markers.
  markers=`aws s3api list-object-versions \
    --bucket "$i" \
    --output=json \
    --query='{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId} }'`
  if ! echo $markers | grep -q '"Objects": null'; then
    aws s3api delete-objects \
      --bucket $i \
      --delete "$markers" > /dev/null 2>&1
  fi

  # Empty the bucket
  aws s3 rm s3://$i/ --recursive
done

# Trigger a delete for each cloudformation stack
for i in "${stackList[@]}"
do
  echo $i
  aws cloudformation delete-stack --stack-name $i
done
