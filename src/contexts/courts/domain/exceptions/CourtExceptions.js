const DomainException = require('../../../../shared/domain/DomainException');

class CourtNotFound extends DomainException {
  constructor() { super('Cancha no encontrada', 404); }
}

class CourtNotAvailable extends DomainException {
  constructor() { super('La cancha no está disponible', 409); }
}

class UnauthorizedCourtAccess extends DomainException {
  constructor() { super('No tienes permiso para modificar esta cancha', 403); }
}

module.exports = { CourtNotFound, CourtNotAvailable, UnauthorizedCourtAccess };
