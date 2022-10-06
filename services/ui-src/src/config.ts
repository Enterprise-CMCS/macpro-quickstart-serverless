const configToExport = {
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
    PROXY_URL: window._env_.PROXY_API_URL,
  },
  cognito: {
    REGION: window._env_.COGNITO_REGION,
    USER_POOL_ID: window._env_.COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: window._env_.COGNITO_USER_POOL_CLIENT_ID,
    APP_CLIENT_DOMAIN: window._env_.COGNITO_USER_POOL_CLIENT_DOMAIN,
    IDENTITY_POOL_ID: window._env_.COGNITO_IDENTITY_POOL_ID,
    REDIRECT_SIGNIN: window._env_.COGNITO_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: window._env_.COGNITO_REDIRECT_SIGNOUT,
    ALLOW_ADMIN_SCOPE: window._env_.ALLOW_ADMIN_SCOPE,
  },
};

export default configToExport;
