/** PM2 ecosystem config – used in Docker and optionally for local PM2 runs */
module.exports = {
  apps: [
    {
      name: 'jewelry-store',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
