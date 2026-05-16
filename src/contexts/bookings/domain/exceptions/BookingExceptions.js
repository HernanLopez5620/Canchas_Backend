const DomainException = require('../../../../shared/domain/DomainException');

class BookingNotFound extends DomainException {
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
