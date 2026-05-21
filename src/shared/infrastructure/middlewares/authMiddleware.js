const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authMiddleware(req, res, next) {
<<<<<<< HEAD
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, message: 'Token requerido' });
    }

=======
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, message: 'Token requerido' });
    }
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, env.jwtSecret);
        next();
    } catch {
        return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
    }
}

<<<<<<< HEAD
module.exports = authMiddleware;
=======
module.exports = authMiddleware;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
