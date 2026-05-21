const DomainException = require('../../../../shared/domain/DomainException');

class VenueNotFound extends DomainException {
<<<<<<< HEAD
    constructor() { super('Venue no encontrado', 404); }
}

class VenueUnauthorized extends DomainException {
    constructor() { super('No autorizado para este venue', 403); }
}

module.exports = { VenueNotFound, VenueUnauthorized };
=======
    constructor() { super('Centro deportivo no encontrado', 404); }
}

class UnauthorizedVenueAccess extends DomainException {
    constructor() { super('No tienes permiso para modificar este centro deportivo', 403); }
}

module.exports = { VenueNotFound, UnauthorizedVenueAccess };
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
