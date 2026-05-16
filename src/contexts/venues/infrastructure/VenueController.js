// ============================================================
// src/contexts/venues/infrastructure/VenueController.js
// ============================================================
const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');

const MySqlVenueRepository = require('./MySqlVenueRepository');
const { CreateVenue, GetVenue, ListVenuesByCity, GetMyVenues } = require('../application/VenueUseCases');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');
const ownerGuard = require('../../../shared/infrastructure/middlewares/ownerGuard');

const router = Router();
const repository = new MySqlVenueRepository();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ ok: false, errors: errors.array() });
  next();
}

// ── POST /api/venues  (solo owners) ──────────────────────────
router.post('/',
  authMiddleware,
  ownerGuard,
  [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('address').trim().notEmpty().withMessage('La dirección es requerida'),
    body('city').trim().notEmpty().withMessage('La ciudad es requerida'),
    body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
    body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const useCase = new CreateVenue(repository);
      const result = await useCase.execute({ ...req.body, ownerId: req.user.sub });
      return res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

// ── GET /api/venues?city=Fusagasuga ──────────────────────────
router.get('/',
  [query('city').trim().notEmpty().withMessage('El parámetro city es requerido')],
  validate,
  async (req, res, next) => {
    try {
      const useCase = new ListVenuesByCity(repository);
      const result = await useCase.execute({ city: req.query.city });
      return res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

// ── GET /api/venues/my  (venues del owner autenticado) ───────
router.get('/my',
  authMiddleware,
  ownerGuard,
  async (req, res, next) => {
    try {
      const useCase = new GetMyVenues(repository);
      const result = await useCase.execute({ ownerId: req.user.sub });
      return res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

// ── GET /api/venues/:id ───────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const useCase = new GetVenue(repository);
    const result = await useCase.execute({ venueId: Number(req.params.id) });
    return res.status(200).json({ ok: true, data: result });
  } catch (err) { next(err); }
});

module.exports = router;
