const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const MySqlVenueRepository = require('./MySqlVenueRepository');
const { CreateVenue, GetVenue, ListVenuesByCity, GetMyVenues } = require('../application/VenueUseCases');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');
const ownerGuard     = require('../../../shared/infrastructure/middlewares/ownerGuard');

const router = Router();
const repo   = new MySqlVenueRepository();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ ok: false, errors: errors.array() });
    next();
}

// GET /api/venues?city=Bogotá
router.get('/', [
    query('city').optional().trim(),
    validate,
], async (req, res, next) => {
    try {
        const city = req.query.city || '';
        const result = await new ListVenuesByCity(repo).execute({ city });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// GET /api/venues/my
router.get('/my', authMiddleware, ownerGuard, async (req, res, next) => {
    try {
        const result = await new GetMyVenues(repo).execute({ ownerId: req.user.sub });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// GET /api/venues/:id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await new GetVenue(repo).execute({ venueId: +req.params.id });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// POST /api/venues
router.post('/', authMiddleware, ownerGuard, [
    body('name').trim().notEmpty().withMessage('Nombre requerido'),
    body('address').trim().notEmpty().withMessage('Dirección requerida'),
    body('city').trim().notEmpty().withMessage('Ciudad requerida'),
    body('lat').optional().isFloat(),
    body('lng').optional().isFloat(),
    validate,
], async (req, res, next) => {
    try {
        const result = await new CreateVenue(repo).execute({
            ownerId: req.user.sub, ...req.body,
        });
        res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

module.exports = router;