#!/bin/bash
# ============================================
# CloudCart — AWS Resource Cleanup Script
# Run this to delete all AWS resources created for this project
# to avoid unexpected charges.
# ============================================

echo "=========================================="
echo "CloudCart AWS Cleanup"
echo "=========================================="
echo ""
echo "This script will help you delete all AWS resources."
echo "Review each step carefully before confirming."
echo ""

# --- S3 Bucket ---
echo "[1/5] S3 Bucket"
echo "  Delete all objects and the bucket:"
echo "  aws s3 rb s3://YOUR_BUCKET_NAME --force"
echo ""

# --- CloudWatch ---
echo "[2/5] CloudWatch"
echo "  Delete log group:"
echo "  aws logs delete-log-group --log-group-name /cloudcart/application"
echo ""
echo "  Delete alarms:"
echo "  aws cloudwatch delete-alarms --alarm-names cloudcart-cpu-alarm"
echo ""

# --- IAM ---
echo "[3/5] IAM"
echo "  Detach policy from role:"
echo "  aws iam detach-role-policy --role-name cloudcart-ec2-role --policy-arn YOUR_POLICY_ARN"
echo ""
echo "  Remove role from instance profile:"
echo "  aws iam remove-role-from-instance-profile --instance-profile-name cloudcart-ec2-profile --role-name cloudcart-ec2-role"
echo ""
echo "  Delete instance profile:"
echo "  aws iam delete-instance-profile --instance-profile-name cloudcart-ec2-profile"
echo ""
echo "  Delete policy:"
echo "  aws iam delete-policy --policy-arn YOUR_POLICY_ARN"
echo ""
echo "  Delete role:"
echo "  aws iam delete-role --role-name cloudcart-ec2-role"
echo ""

# --- Elastic IP ---
echo "[4/5] Elastic IP"
echo "  Disassociate and release:"
echo "  aws ec2 disassociate-address --association-id YOUR_ASSOC_ID"
echo "  aws ec2 release-address --allocation-id YOUR_ALLOC_ID"
echo ""

# --- EC2 Instance ---
echo "[5/5] EC2 Instance"
echo "  Terminate the instance:"
echo "  aws ec2 terminate-instances --instance-ids YOUR_INSTANCE_ID"
echo ""
echo "  Delete security group (after instance terminates):"
echo "  aws ec2 delete-security-group --group-id YOUR_SG_ID"
echo ""
echo "  Delete key pair:"
echo "  aws ec2 delete-key-pair --key-name cloudcart-key"
echo ""

echo "=========================================="
echo "Verify in AWS Console that all resources are deleted!"
echo "Check: EC2, S3, IAM, CloudWatch, VPC Security Groups"
echo "=========================================="
