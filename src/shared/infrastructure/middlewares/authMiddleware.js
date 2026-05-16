const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, message: 'Token requerido' });
    }
    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, env.jwtSecret);
        next();
    } catch {
        return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
    }
}

module.exports = authMiddleware;