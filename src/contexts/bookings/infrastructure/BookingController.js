const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const MySqlBookingRepository = require('./MySqlBookingRepository');
const MySqlCourtRepository   = require('../../courts/infrastructure/MySqlCourtRepository');
const {
    CreateBooking, CancelBooking,
    GetBookingsByUser, GetAvailableSlots,
} = require('../application/BookingUseCases');
const authMiddleware = require('../../../shared/infrastructure/middlewares/authMiddleware');

const router        = Router();
const bookingRepo   = new MySqlBookingRepository();
const courtRepo     = new MySqlCourtRepository();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ ok: false, errors: errors.array() });
    next();
}

// GET /api/bookings/slots?courtId=1&date=2026-05-20
router.get('/slots', [
    query('courtId').isInt({ min: 1 }),
    query('date').isDate(),
    validate,
], async (req, res, next) => {
    try {
        const result = await new GetAvailableSlots(bookingRepo, courtRepo)
            .execute({ courtId: +req.query.courtId, date: req.query.date });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// GET /api/bookings/my
router.get('/my', authMiddleware, async (req, res, next) => {
    try {
        const result = await new GetBookingsByUser(bookingRepo)
            .execute({ userId: req.user.sub });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// POST /api/bookings
router.post('/', authMiddleware, [
    body('courtId').isInt({ min: 1 }),
    body('bookingDate').isDate(),
    body('startTime').matches(/^\d{2}:\d{2}$/),
    body('endTime').matches(/^\d{2}:\d{2}$/),
    body('notes').optional().isString(),
    validate,
], async (req, res, next) => {
    try {
        const result = await new CreateBooking(bookingRepo, courtRepo)
            .execute({ userId: req.user.sub, ...req.body });
        res.status(201).json({ ok: true, data: result });
    } catch (err) { next(err); }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authMiddleware, async (req, res, next) => {
    try {
        const result = await new CancelBooking(bookingRepo).execute({
            bookingId:     +req.params.id,
            requesterId:   req.user.sub,
            requesterRole: req.user.role,
            reason:        req.body.reason,
        });
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
});

module.exports = router;