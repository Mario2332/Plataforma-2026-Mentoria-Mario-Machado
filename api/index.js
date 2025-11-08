// Vercel Serverless Function entry point
import('../server/_core/index.js').then(({ app }) => {
  module.exports = app;
}).catch(err => {
  console.error('Failed to load app:', err);
  module.exports = (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
  };
});
