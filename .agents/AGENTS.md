# AWS Agent Toolkit Configuration

## AWS MCP Server
The AWS MCP Server is configured for this workspace. Use it for AWS API access and documentation search.

## AWS Credentials
- **Region**: us-east-1
- **Account**: 304534109847
- Authentication is managed via the AWS CLI. Credentials are valid for 12 hours and can be renewed for 90 days.

## AWS Skills
AWS Agent Toolkit skills are loaded from `~/.aws/agent-toolkit-for-aws/plugins/`. These include:
- **aws-core**: CDK, CloudFormation, serverless, containers, storage, observability, billing, SDK usage, deployment
- **aws-agents**: Building AI agents on AWS with Amazon Bedrock and AgentCore
- **aws-data-analytics**: Data lake, analytics, and ETL workflows with S3 Tables, AWS Glue, and Athena

## Rules
- Always use `us-east-1` as the default region unless the user specifies otherwise.
- Use the AWS SDK best practices from the agent toolkit skills when building AWS integrations.
- Prefer CDK over raw CloudFormation when creating infrastructure.
