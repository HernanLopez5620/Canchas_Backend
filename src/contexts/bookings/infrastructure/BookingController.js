const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');

const MySqlBookingRepository = require('./MySqlBookingRepository');
const MySqlCourtRepository   = require('../../courts/infrastructure/MySqlCourtRepository');
const {
  CreateBooking, CancelBooking, GetBookingsByUser, GetAvailableSlots
} = require('../application/BookingUseCases');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');

const router            = Router();
const bookingRepository = new MySqlBookingRepository();
const courtRepository   = new MySqlCourtRepository();

// ── Job: expirar reservas pending cada 5 minutos ──────────────
setInterval(async () => {
  try {
    await bookingRepository.expireOldPending();
  } catch (err) {
    console.error('[Booking expiry job]', err.message);
  }
}, 5 * 60 * 1000);

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ ok: false, errors: errors.array() });
  next();
}

// ── GET /api/bookings/slots?courtId=1&date=2026-05-20 ────────
router.get('/slots',
  [
    query('courtId').isInt({ min: 1 }).withMessage('courtId inválido'),
    query('date').isDate().withMessage('date inválido (YYYY-MM-DD)'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const useCase = new GetAvailableSlots(bookingRepository, courtRepository);
      const result  = await useCase.execute({
        courtId: Number(req.query.courtId),
        date:    req.query.date,
      });
      return res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

// ── GET /api/bookings/my  (reservas del usuario autenticado) ──
router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const useCase = new GetBookingsByUser(bookingRepository);
    const result  = await useCase.execute({ userId: req.user.sub });
    return res.status(200).json({ ok: true, data: result });
  } catch (err) { next(err); }
});

// ── POST /api/bookings ────────────────────────────────────────
router.post('/',
  authMiddleware,
  [
    body('courtId').isInt({ min: 1 }).withMessage('courtId inválido'),
    body('bookingDate').isDate().withMessage('bookingDate inválido (YYYY-MM-DD)'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('startTime inválido (HH:MM)'),
    body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('endTime inválido (HH:MM)'),
    body('notes').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const useCase = new CreateBooking(bookingRepository, courtRepository);
      const result  = await useCase.execute({ ...req.body, userId: req.user.sub });
      return res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

// ── PUT /api/bookings/:id/cancel ──────────────────────────────
router.put('/:id/cancel',
  authMiddleware,
  async (req, res, next) => {
    try {
      const useCase = new CancelBooking(bookingRepository);
      const result  = await useCase.execute({
        bookingId:     Number(req.params.id),
        requesterId:   req.user.sub,
        requesterRole: req.user.role,
        reason:        req.body.reason,
      });
      return res.status(200).json({ ok: true, data: result });
    } catch (err) { next(err); }
  }
);

module.exports = router;
