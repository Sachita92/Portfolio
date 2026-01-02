module.exports = function handler(req, res) {
  return res.status(200).json({ 
    message: 'API server is running!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
}

