const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const MySqlUserRepository = require('./MySqlUserRepository');
const RegisterUser    = require('../application/RegisterUser');
const LoginUser       = require('../application/LoginUser');
const GetUserProfile  = require('../application/GetUserProfile');
const authMiddleware  = require('../../../shared/infrastructure/middlewares/authMiddleware');

const router = Router();
const repo   = new MySqlUserRepository();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ ok: false, errors: errors.array() });
    next();
}

// POST /api/users/register
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('role').optional().isIn(['player', 'owner']),
    validate,
], async (req, res, next) => {
    try {
        const result = await new RegisterUser(repo).execute(req.body);
        res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// POST /api/users/login
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty(),
    validate,
], async (req, res, next) => {
    try {
        const result = await new LoginUser(repo).execute(req.body);
        res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const result = await new GetUserProfile(repo).execute({ userId: req.user.sub });
        res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

module.exports = router;