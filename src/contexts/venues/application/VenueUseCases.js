<<<<<<< HEAD
const Venue = require('../domain/Venue');
const { VenueNotFound, VenueUnauthorized } = require('../domain/exceptions/VenueExceptions');

class CreateVenue {
    constructor(venueRepository) { this.venueRepository = venueRepository; }
=======
// ============================================================
// CreateVenue.js
// ============================================================
const Venue = require('../domain/Venue');

class CreateVenue {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

    async execute({ ownerId, name, description, address, city, lat, lng, phone }) {
        const venue = new Venue({ ownerId, name, description, address, city, lat, lng, phone });
        const saved = await this.venueRepository.save(venue);
        return { venue: saved.toPublic() };
    }
}

<<<<<<< HEAD
class GetVenue {
    constructor(venueRepository) { this.venueRepository = venueRepository; }
=======
// ============================================================
// GetVenue.js
// ============================================================
const { VenueNotFound } = require('../domain/exceptions/VenueExceptions');

class GetVenue {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

    async execute({ venueId }) {
        const venue = await this.venueRepository.findById(venueId);
        if (!venue) throw new VenueNotFound();
        return { venue: venue.toPublic() };
    }
}

<<<<<<< HEAD
class ListVenuesByCity {
    constructor(venueRepository) { this.venueRepository = venueRepository; }
=======
// ============================================================
// ListVenuesByCity.js
// ============================================================
class ListVenuesByCity {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

    async execute({ city }) {
        const venues = await this.venueRepository.findByCity(city);
        return { venues: venues.map(v => v.toPublic()) };
    }
}

<<<<<<< HEAD
class GetMyVenues {
    constructor(venueRepository) { this.venueRepository = venueRepository; }
=======
// ============================================================
// GetMyVenues.js  (venues del owner autenticado)
// ============================================================
class GetMyVenues {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

    async execute({ ownerId }) {
        const venues = await this.venueRepository.findByOwner(ownerId);
        return { venues: venues.map(v => v.toPublic()) };
    }
}

<<<<<<< HEAD
module.exports = { CreateVenue, GetVenue, ListVenuesByCity, GetMyVenues };
=======
module.exports = { CreateVenue, GetVenue, ListVenuesByCity, GetMyVenues };
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
