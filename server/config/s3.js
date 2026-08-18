const { S3Client } = require('@aws-sdk/client-s3');
const config = require('./index');

// S3 client uses:
//   - EC2 IAM Role credentials in production (automatic)
//   - Environment variable credentials in local development
const s3Client = new S3Client({
  region: config.aws.region,
});

module.exports = s3Client;
