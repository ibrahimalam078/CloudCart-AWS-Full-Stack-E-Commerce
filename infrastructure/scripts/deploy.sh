#!/bin/bash
# ============================================
# CloudCart — Deployment Script
# Run this on EC2 to deploy/update the application
# ============================================

set -e

APP_DIR="/home/ubuntu/cloudcart"

echo "=========================================="
echo "CloudCart Deployment — Starting"
echo "=========================================="

cd "$APP_DIR"

# Pull latest code
echo "[1/6] Pulling latest code..."
git pull origin main

# Install server dependencies
echo "[2/6] Installing server dependencies..."
cd "$APP_DIR/server"
npm install --production

# Install client dependencies and build
echo "[3/6] Building frontend..."
cd "$APP_DIR/client"
npm install
npm run build

# Copy Nginx config
echo "[4/6] Configuring Nginx..."
sudo cp "$APP_DIR/infrastructure/nginx/cloudcart.conf" /etc/nginx/sites-available/cloudcart
sudo ln -sf /etc/nginx/sites-available/cloudcart /etc/nginx/sites-enabled/cloudcart
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Restart PM2 application
echo "[5/6] Restarting application with PM2..."
cd "$APP_DIR/server"
pm2 startOrRestart "$APP_DIR/infrastructure/pm2/ecosystem.config.js" --env production

# Save PM2 process list and configure startup
echo "[6/6] Saving PM2 configuration..."
pm2 save

echo "=========================================="
echo "CloudCart Deployment — Complete"
echo "=========================================="
echo ""
echo "Application status:"
pm2 status
echo ""
echo "Test: curl http://localhost/api/health"
