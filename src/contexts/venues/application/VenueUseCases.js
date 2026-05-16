// ============================================================
// CreateVenue.js
// ============================================================
const Venue = require('../domain/Venue');

class CreateVenue {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }

    async execute({ ownerId, name, description, address, city, lat, lng, phone }) {
        const venue = new Venue({ ownerId, name, description, address, city, lat, lng, phone });
        const saved = await this.venueRepository.save(venue);
        return { venue: saved.toPublic() };
    }
}

// ============================================================
// GetVenue.js
// ============================================================
const { VenueNotFound } = require('../domain/exceptions/VenueExceptions');

class GetVenue {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }

    async execute({ venueId }) {
        const venue = await this.venueRepository.findById(venueId);
        if (!venue) throw new VenueNotFound();
        return { venue: venue.toPublic() };
    }
}

// ============================================================
// ListVenuesByCity.js
// ============================================================
class ListVenuesByCity {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }

    async execute({ city }) {
        const venues = await this.venueRepository.findByCity(city);
        return { venues: venues.map(v => v.toPublic()) };
    }
}

// ============================================================
// GetMyVenues.js  (venues del owner autenticado)
// ============================================================
class GetMyVenues {
    constructor(venueRepository) {
        this.venueRepository = venueRepository;
    }

    async execute({ ownerId }) {
        const venues = await this.venueRepository.findByOwner(ownerId);
        return { venues: venues.map(v => v.toPublic()) };
    }
}

module.exports = { CreateVenue, GetVenue, ListVenuesByCity, GetMyVenues };
