const DomainException = require('../../../../shared/domain/DomainException');

class BookingNotFound extends DomainException {
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