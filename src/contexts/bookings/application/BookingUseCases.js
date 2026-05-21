const Booking = require('../domain/Booking');
const {
<<<<<<< HEAD
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
=======
  BookingNotFound,
  SlotNotAvailable,
  CannotCancelBooking,
  UnauthorizedBookingAccess,
} = require('../domain/exceptions/BookingExceptions');

const PLATFORM_FEE_PERCENT = 0.10; // 10% de comisión
const EXPIRY_MINUTES       = 15;   // minutos para pagar

// ============================================================
// CreateBooking.js
// ============================================================
class CreateBooking {
  constructor(bookingRepository, courtRepository) {
    this.bookingRepository = bookingRepository;
    this.courtRepository   = courtRepository;
  }

  async execute({ courtId, userId, bookingDate, startTime, endTime, notes }) {
    // 1. Verificar que la cancha existe
    const court = await this.courtRepository.findById(courtId);
    if (!court) throw new BookingNotFound();

    // 2. Verificar disponibilidad del slot
    const taken = await this.bookingRepository.isSlotTaken(courtId, bookingDate, startTime);
    if (taken) throw new SlotNotAvailable();

    // 3. Calcular precio y comisión
    const totalPrice  = parseFloat(court.basePrice);
    const platformFee = parseFloat((totalPrice * PLATFORM_FEE_PERCENT).toFixed(2));

    // 4. Calcular expiración (15 min desde ahora)
    const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    // 5. Crear la reserva
    const booking = new Booking({
      courtId, userId, bookingDate, startTime, endTime,
      totalPrice, platformFee, notes, expiresAt,
      status: 'pending',
    });

    const saved = await this.bookingRepository.save(booking);
    return { booking: saved.toPublic() };
  }
}

// ============================================================
// CancelBooking.js
// ============================================================
class CancelBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ bookingId, requesterId, requesterRole, reason }) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new BookingNotFound();

    // Solo el usuario dueño o un owner/admin puede cancelar
    const isOwnerOrAdmin = requesterRole === 'owner' || requesterRole === 'admin';
    if (booking.userId !== requesterId && !isOwnerOrAdmin) {
      throw new UnauthorizedBookingAccess();
    }

    if (!booking.canBeCancelledByUser()) throw new CannotCancelBooking();

    booking.status          = isOwnerOrAdmin ? 'cancelled_owner' : 'cancelled_user';
    booking.cancelledReason = reason ?? null;

    const updated = await this.bookingRepository.update(booking);
    return { booking: updated.toPublic() };
  }
}

// ============================================================
// GetBookingsByUser.js
// ============================================================
class GetBookingsByUser {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ userId }) {
    const bookings = await this.bookingRepository.findByUser(userId);
    return { bookings: bookings.map(b => b.toPublic()) };
  }
}

// ============================================================
// GetAvailableSlots.js — horarios disponibles de una cancha
// ============================================================
class GetAvailableSlots {
  constructor(bookingRepository, courtRepository) {
    this.bookingRepository = bookingRepository;
    this.courtRepository   = courtRepository;
  }

  async execute({ courtId, date }) {
    const court = await this.courtRepository.findById(courtId);
    if (!court) throw new BookingNotFound();

    // Reservas existentes para ese día
    const existing = await this.bookingRepository.findByCourt(courtId, date);
    const takenSlots = existing
      .filter(b => b.status !== 'cancelled_user' && b.status !== 'cancelled_owner' && b.status !== 'expired')
      .map(b => b.startTime);

    // Generar todos los slots de 6am a 10pm cada hora
    const allSlots = [];
    for (let h = 6; h < 22; h++) {
      const start = `${String(h).padStart(2, '0')}:00:00`;
      const end   = `${String(h + 1).padStart(2, '0')}:00:00`;
      allSlots.push({
        startTime: start,
        endTime:   end,
        available: !takenSlots.includes(start),
        price:     court.basePrice,
      });
    }

    return { date, courtId, slots: allSlots };
  }
}

module.exports = { CreateBooking, CancelBooking, GetBookingsByUser, GetAvailableSlots };
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
