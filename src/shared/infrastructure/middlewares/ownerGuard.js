function ownerGuard(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ ok: false, message: 'Token requerido' });
  }
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Solo los dueños de canchas pueden realizar esta acción' });
  }
  next();
}

module.exports = ownerGuard;
