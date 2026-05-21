function errorHandler(err, req, res, next) {
<<<<<<< HEAD
    const status  = err.statusCode || 500;
    const message = err.message    || 'Error interno del servidor';

    if (status === 500) {
        console.error('[Error]', err);
    }

    res.status(status).json({ ok: false, message });
}

module.exports = errorHandler;
=======
    const statusCode = err.statusCode ?? 500;
    const message = err.statusCode ? err.message : 'Error interno del servidor';
    if (!err.statusCode) console.error('[ERROR]', err);
    return res.status(statusCode).json({ ok: false, message });
}

module.exports = errorHandler;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
