module.exports = {
  apps: [
    {
      name: 'cloudcart-api',
      script: './server.js',
      cwd: '/home/ubuntu/cloudcart/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Log configuration
      error_file: '/home/ubuntu/cloudcart/logs/pm2-error.log',
      out_file: '/home/ubuntu/cloudcart/logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Restart policy
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
