const DomainException = require('../../../../shared/domain/DomainException');

class BookingNotFound extends DomainException {
<<<<<<< HEAD
    constructor() { super('Reserva no encontrada', 404); }
}

class BookingConflict extends DomainException {
    constructor() { super('La cancha ya está reservada en ese horario', 409); }
}

class BookingUnauthorized extends DomainException {
    constructor() { super('No autorizado para cancelar esta reserva', 403); }
}

class BookingNotCancellable extends DomainException {
    constructor() { super('Esta reserva no puede cancelarse', 422); }
}

module.exports = { BookingNotFound, BookingConflict, BookingUnauthorized, BookingNotCancellable };
=======
  constructor() { super('Reserva no encontrada', 404); }
}

class SlotNotAvailable extends DomainException {
  constructor() { super('Este horario ya está reservado', 409); }
}

class BookingAlreadyConfirmed extends DomainException {
  constructor() { super('La reserva ya está confirmada', 400); }
}

class CannotCancelBooking extends DomainException {
  constructor() { super('Esta reserva no puede ser cancelada', 400); }
}

class UnauthorizedBookingAccess extends DomainException {
  constructor() { super('No tienes permiso para modificar esta reserva', 403); }
}

module.exports = {
  BookingNotFound,
  SlotNotAvailable,
  BookingAlreadyConfirmed,
  CannotCancelBooking,
  UnauthorizedBookingAccess,
};
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
