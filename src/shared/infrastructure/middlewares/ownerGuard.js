function ownerGuard(req, res, next) {
<<<<<<< HEAD
    if (req.user?.role !== 'owner' && req.user?.role !== 'admin') {
        return res.status(403).json({
            ok: false,
            message: 'Solo los dueños de cancha pueden realizar esta acción',
        });
    }
    next();
}

module.exports = ownerGuard;

=======
  if (!req.user) {
    return res.status(401).json({ ok: false, message: 'Token requerido' });
  }
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Solo los dueños de canchas pueden realizar esta acción' });
  }
  next();
}

module.exports = ownerGuard;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
