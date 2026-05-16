const Court = require('../domain/Court');
const { CourtNotFound, UnauthorizedCourtAccess } = require('../domain/exceptions/CourtExceptions');

// ============================================================
// CreateCourt.js
// ============================================================
class CreateCourt {
  constructor(courtRepository, venueRepository) {
    this.courtRepository = courtRepository;
    this.venueRepository = venueRepository;
  }

  async execute({ venueId, sportId, name, description, surface, isIndoor, basePrice, capacity, requesterId }) {
    // Verificar que el venue pertenece al owner
    const venue = await this.venueRepository.findById(venueId);
    if (!venue) throw new CourtNotFound();
    if (venue.ownerId !== requesterId) throw new UnauthorizedCourtAccess();

    const court = new Court({ venueId, sportId, name, description, surface, isIndoor, basePrice, capacity });
    const saved = await this.courtRepository.save(court);
    return { court: saved.toPublic() };
  }
}

// ============================================================
// GetCourt.js
// ============================================================
class GetCourt {
  constructor(courtRepository) {
    this.courtRepository = courtRepository;
  }

  async execute({ courtId }) {
    const court = await this.courtRepository.findById(courtId);
    if (!court) throw new CourtNotFound();
    return { court: court.toPublic() };
  }
}

// ============================================================
// ListCourtsByVenue.js
// ============================================================
class ListCourtsByVenue {
  constructor(courtRepository) {
    this.courtRepository = courtRepository;
  }

  async execute({ venueId }) {
    const courts = await this.courtRepository.findByVenue(venueId);
    return { courts: courts.map(c => c.toPublic()) };
  }
}

// ============================================================
// UpdateCourt.js
// ============================================================
class UpdateCourt {
  constructor(courtRepository, venueRepository) {
    this.courtRepository = courtRepository;
    this.venueRepository = venueRepository;
  }

  async execute({ courtId, requesterId, ...fields }) {
    const court = await this.courtRepository.findById(courtId);
    if (!court) throw new CourtNotFound();

    const venue = await this.venueRepository.findById(court.venueId);
    if (venue.ownerId !== requesterId) throw new UnauthorizedCourtAccess();

    // Actualizar solo los campos enviados
    Object.assign(court, fields);
    const updated = await this.courtRepository.update(court);
    return { court: updated.toPublic() };
  }
}

module.exports = { CreateCourt, GetCourt, ListCourtsByVenue, UpdateCourt };
