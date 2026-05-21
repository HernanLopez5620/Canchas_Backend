function ownerGuard(req, res, next) {
    if (req.user?.role !== 'owner' && req.user?.role !== 'admin') {
        return res.status(403).json({
            ok: false,
            message: 'Solo los dueños de cancha pueden realizar esta acción',
        });
    }
    next();
}

module.exports = ownerGuard;

