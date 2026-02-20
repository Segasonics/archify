function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
    requestId: req.id,
  });
}

module.exports = notFound;

