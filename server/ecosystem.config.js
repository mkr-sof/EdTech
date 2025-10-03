module.exports = {
  apps: [{
    name: "edtech-server",
    script: "index.js",         // change if your entry file is different
    cwd: "/home/deployer/apps/edtech/server", // change on server if you use different path
    env_production: {
      NODE_ENV: "production",
      PORT: 4000
    }
  }]
};
