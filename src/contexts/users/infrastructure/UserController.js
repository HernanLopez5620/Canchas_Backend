const { Router } = require('express');
const { body, validationResult } = require('express-validator');
<<<<<<< HEAD
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
=======

const MySqlUserRepository = require('./MySqlUserRepository');
const RegisterUser = require('../application/RegisterUser');
const LoginUser = require('../application/LoginUser');
const GetUserProfile = require('../application/GetUserProfile');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');
const env = require('../../../shared/infrastructure/config/env');

const router = Router();
const repository = new MySqlUserRepository();

// ── Validaciones ─────────────────────────────────────────────
const registerValidations = [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
    body('role').optional().isIn(['player', 'owner']).withMessage('Rol inválido'),
];

const loginValidations = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ ok: false, errors: errors.array() });
    }
    next();
}

// ── POST /api/users/register ──────────────────────────────────
router.post('/register', registerValidations, validate, async (req, res, next) => {
    try {
        const useCase = new RegisterUser(repository);
        const result = await useCase.execute(req.body);
        return res.status(201).json({ ok: true, data: result });
    } catch (err) {
        next(err);
    }
});

// ── POST /api/users/login ─────────────────────────────────────
router.post('/login', loginValidations, validate, async (req, res, next) => {
    try {
        const useCase = new LoginUser(repository, {
            jwtSecret: env.jwtSecret,
            jwtExpiresIn: env.jwtExpiresIn,
        });
        const result = await useCase.execute(req.body);
        return res.status(200).json({ ok: true, data: result });
    } catch (err) {
        next(err);
    }
});

// ── GET /api/users/me  (requiere token) ───────────────────────
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const useCase = new GetUserProfile(repository);
        const result = await useCase.execute({ userId: req.user.sub });
        return res.status(200).json({ ok: true, data: result });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
