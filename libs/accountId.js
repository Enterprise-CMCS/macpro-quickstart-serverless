const config = {};
config.accountId = function (context) {
  return context.providers.aws.getAccountId();
};

module.exports = config;
