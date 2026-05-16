function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.statusCode ? err.message : 'Error interno del servidor';
    if (!err.statusCode) console.error('[ERROR]', err);
    return res.status(statusCode).json({ ok: false, message });
}

module.exports = errorHandler;