const DomainException = require('../../../../shared/domain/DomainException');

class VenueNotFound extends DomainException {
    constructor() { super('Centro deportivo no encontrado', 404); }
}

class UnauthorizedVenueAccess extends DomainException {
    constructor() { super('No tienes permiso para modificar este centro deportivo', 403); }
}

module.exports = { VenueNotFound, UnauthorizedVenueAccess };
