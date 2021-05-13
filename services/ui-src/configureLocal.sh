
set -e

echo """
Please Note:
  This script exists to enable a developer to run a react frontend locally while pointing to an AWS backend.
  This is *not* the same as deploying the entire stack locally.
  This script may be removed soon, as the much more powerful local workflow should make this osoblete.
  However, it will be left for now.
  Please make sure you understand what this script does and why you're using it.
"""

stage=${1:-dev}

echo "Fetching information for stage $stage..."

api_region=`sh ../output.sh ../app-api Region $stage`
api_url=`sh ../output.sh ../app-api ApiGatewayRestApiUrl $stage`
api_graphql_region=`../output.sh ../apollo-lambda Region $stage`
api_graphql_url=`../output.sh ../apollo-lambda ApiGatewayRestApiUrl $stage`
cognito_region=`sh ../output.sh ../ui-auth Region $stage`
cognito_identity_pool_id=`sh ../output.sh ../ui-auth IdentityPoolId $stage`
cognito_user_pool_id=`sh ../output.sh ../ui-auth UserPoolId $stage`
cognito_user_pool_client_id=`sh ../output.sh ../ui-auth UserPoolClientId $stage`
cognito_user_pool_client_domain=`sh ../output.sh ../ui-auth UserPoolClientDomain $stage`
s3_attachments_bucket_region=`sh ../output.sh ../uploads Region $stage`
s3_attachements_bucket_name=`sh ../output.sh ../uploads AttachmentsBucketName $stage`

export API_REGION=$api_region
export API_URL=$api_url
export API_GRAPHQL_REGION=$api_graphql_region
export API_GRAPHQL_URL=$api_graphql_url
export COGNITO_REGION=$cognito_region
export COGNITO_IDENTITY_POOL_ID=$cognito_identity_pool_id
export COGNITO_USER_POOL_ID=$cognito_user_pool_id
export COGNITO_USER_POOL_CLIENT_ID=$cognito_user_pool_client_id
export COGNITO_USER_POOL_CLIENT_DOMAIN=$cognito_user_pool_client_domain
export COGNITO_REDIRECT_SIGNIN=http://localhost:3000/
export COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/
export S3_ATTACHMENTS_BUCKET_REGION=$s3_attachments_bucket_region
export S3_ATTACHMENTS_BUCKET_NAME=$s3_attachements_bucket_name
# This is set to false, as using this script points your local react server to Amazon
export LOCAL_LOGIN=false

./env.sh
