const Booking = require('../domain/Booking');
const {
    BookingNotFound, BookingConflict,
    BookingUnauthorized, BookingNotCancellable,
} = require('../domain/exceptions/BookingExceptions');
const { CourtNotFound } = require('../../courts/domain/exceptions/CourtExceptions');

class CreateBooking {
    constructor(bookingRepository, courtRepository) {
        this.bookingRepository = bookingRepository;
        this.courtRepository   = courtRepository;
    }

    async execute({ userId, courtId, bookingDate, startTime, endTime, notes }) {
        const court = await this.courtRepository.findById(courtId);
        if (!court) throw new CourtNotFound();

        const conflict = await this.bookingRepository.hasConflict({
            courtId, bookingDate, startTime, endTime,
        });
        if (conflict) throw new BookingConflict();

        const hours      = this._hoursDiff(startTime, endTime);
        const totalPrice = parseFloat((court.basePrice * hours).toFixed(2));
        const platformFee = parseFloat((totalPrice * 0.10).toFixed(2));

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const booking = new Booking({
            courtId, userId, bookingDate, startTime, endTime,
            totalPrice, platformFee, notes, expiresAt,
        });

        const saved = await this.bookingRepository.save(booking);
        return { booking: saved.toPublic() };
    }

    _hoursDiff(start, end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    }
}

class CancelBooking {
    constructor(bookingRepository) { this.bookingRepository = bookingRepository; }

    async execute({ bookingId, requesterId, requesterRole, reason }) {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) throw new BookingNotFound();

        const isOwner  = requesterRole === 'owner' || requesterRole === 'admin';
        const isPlayer = booking.userId === requesterId;

        if (!isOwner && !isPlayer) throw new BookingUnauthorized();

        if (!['pending', 'confirmed'].includes(booking.status))
            throw new BookingNotCancellable();

        const status = isPlayer ? 'cancelled_user' : 'cancelled_owner';
        await this.bookingRepository.updateStatus({ bookingId, status, reason });

        return { message: 'Reserva cancelada correctamente' };
    }
}

class GetBookingsByUser {
    constructor(bookingRepository) { this.bookingRepository = bookingRepository; }

    async execute({ userId }) {
        const bookings = await this.bookingRepository.findByUser(userId);
        return { bookings: bookings.map(b => b.toPublic()) };
    }
}

class GetAvailableSlots {
    constructor(bookingRepository, courtRepository) {
        this.bookingRepository = bookingRepository;
        this.courtRepository   = courtRepository;
    }

    async execute({ courtId, date }) {
        const court = await this.courtRepository.findById(courtId);
        if (!court) throw new CourtNotFound();

        const slots = await this.bookingRepository.getSlots({ courtId, date });
        return { slots };
    }
}

module.exports = { CreateBooking, CancelBooking, GetBookingsByUser, GetAvailableSlots };