export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  LOCAL_LOGIN: window._env_.LOCAL_LOGIN,
  s3: {
    LOCAL_ENDPOINT: window._env_.S3_LOCAL_ENDPOINT,
    REGION: window._env_.S3_ATTACHMENTS_BUCKET_REGION,
    BUCKET: window._env_.S3_ATTACHMENTS_BUCKET_NAME,
  },
  apiGateway: {
    REGION: window._env_.API_REGION,
    URL: window._env_.API_URL,
  },
  apiGraphqlGateway: {
    REGION: window._env_.API_GRAPHQL_REGION,
    URL: window._env_.API_GRAPHQL_URL,
  },
  cognito: {
    REGION: window._env_.COGNITO_REGION,
    USER_POOL_ID: window._env_.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window._env_.COGNITO_CLIENT_ID,
    IDENTITY_POOL_ID: window._env_.COGNITO_IDENTITY_POOL_ID,
  },
};
