const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const MySqlCourtRepository = require('./MySqlCourtRepository');
const MySqlVenueRepository = require('../../venues/infrastructure/MySqlVenueRepository');
const { CreateCourt, GetCourt, ListCourtsByVenue } = require('../application/CourtUseCases');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');
const ownerGuard     = require('../../../shared/infrastructure/middlewares/ownerGuard');

const router     = Router();
const courtRepo  = new MySqlCourtRepository();
const venueRepo  = new MySqlVenueRepository();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ ok: false, errors: errors.array() });
    next();
}

// GET /api/courts?venueId=1
router.get('/', [
    query('venueId').isInt({ min: 1 }).withMessage('venueId requerido'),
    validate,
], async (req, res, next) => {
    try {
        const result = await new ListCourtsByVenue(courtRepo)
            .execute({ venueId: +req.query.venueId });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// GET /api/courts/:id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await new GetCourt(courtRepo)
            .execute({ courtId: +req.params.id });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// POST /api/courts
router.post('/', authMiddleware, ownerGuard, [
    body('venueId').isInt({ min: 1 }),
    body('sportId').isInt({ min: 1 }),
    body('name').trim().notEmpty(),
    body('basePrice').isFloat({ min: 0 }),
    body('isIndoor').optional().isBoolean(),
    body('capacity').optional().isInt({ min: 1 }),
    validate,
], async (req, res, next) => {
    try {
        const result = await new CreateCourt(courtRepo, venueRepo)
            .execute({ ownerId: req.user.sub, ...req.body });
        res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

module.exports = router;