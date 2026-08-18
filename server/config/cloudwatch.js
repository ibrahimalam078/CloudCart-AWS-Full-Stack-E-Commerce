const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogStreamsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');
const config = require('./index');

const LOG_GROUP_NAME = '/cloudcart/application';

let cloudwatchClient = null;
let logStreamName = null;
let sequenceToken = null;
let initialized = false;

/**
 * Initialize CloudWatch Logs client and create log group/stream.
 * Only active in production — in development, logs go to console/file only.
 */
const initCloudWatch = async () => {
  if (config.env !== 'production') {
    return;
  }

  try {
    cloudwatchClient = new CloudWatchLogsClient({ region: config.aws.region });
    logStreamName = `cloudcart-${new Date().toISOString().split('T')[0]}-${process.pid}`;

    // Create log group (ignore if exists)
    try {
      await cloudwatchClient.send(new CreateLogGroupCommand({ logGroupName: LOG_GROUP_NAME }));
    } catch (err) {
      if (err.name !== 'ResourceAlreadyExistsException') throw err;
    }

    // Create log stream
    try {
      await cloudwatchClient.send(
        new CreateLogStreamCommand({
          logGroupName: LOG_GROUP_NAME,
          logStreamName,
        })
      );
    } catch (err) {
      if (err.name !== 'ResourceAlreadyExistsException') throw err;
    }

    initialized = true;
    console.log(`CloudWatch Logs initialized: ${LOG_GROUP_NAME}/${logStreamName}`);
  } catch (error) {
    console.error('Failed to initialize CloudWatch Logs:', error.message);
    // Non-fatal — application continues without CloudWatch
  }
};

/**
 * Send a log event to CloudWatch Logs.
 */
const sendLog = async (level, message) => {
  if (!initialized || !cloudwatchClient) return;

  try {
    const params = {
      logGroupName: LOG_GROUP_NAME,
      logStreamName,
      logEvents: [
        {
          message: JSON.stringify({ level, message, timestamp: new Date().toISOString() }),
          timestamp: Date.now(),
        },
      ],
    };

    if (sequenceToken) {
      params.sequenceToken = sequenceToken;
    }

    const response = await cloudwatchClient.send(new PutLogEventsCommand(params));
    sequenceToken = response.nextSequenceToken;
  } catch (error) {
    // Silently fail — don't crash app for logging failures
    if (error.name === 'InvalidSequenceTokenException') {
      sequenceToken = error.expectedSequenceToken;
    }
  }
};

module.exports = { initCloudWatch, sendLog, LOG_GROUP_NAME };
