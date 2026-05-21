const DomainException = require('../../../../shared/domain/DomainException');

class VenueNotFound extends DomainException {
    constructor() { super('Venue no encontrado', 404); }
}

class VenueUnauthorized extends DomainException {
    constructor() { super('No autorizado para este venue', 403); }
}

module.exports = { VenueNotFound, VenueUnauthorized };
