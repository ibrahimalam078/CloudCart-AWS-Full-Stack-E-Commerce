#!/bin/bash
# ============================================
# CloudCart — EC2 Initial Setup Script
# Run this after SSH-ing into a fresh Ubuntu EC2 instance
# ============================================

set -e

echo "=========================================="
echo "CloudCart EC2 Setup — Starting"
echo "=========================================="

# Update system
echo "[1/7] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
echo "[2/7] Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install Git
echo "[3/7] Installing Git..."
sudo apt install -y git

# Install Nginx
echo "[4/7] Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# Install PM2 globally
echo "[5/7] Installing PM2..."
sudo npm install -g pm2

# Install AWS CLI
echo "[6/7] Installing AWS CLI..."
sudo apt install -y awscli

# Create project directory
echo "[7/7] Setting up project directory..."
mkdir -p /home/ubuntu/cloudcart/logs

echo "=========================================="
echo "CloudCart EC2 Setup — Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repo: git clone <your-repo-url> /home/ubuntu/cloudcart"
echo "2. Create .env file in /home/ubuntu/cloudcart/"
echo "3. Run deploy.sh"
