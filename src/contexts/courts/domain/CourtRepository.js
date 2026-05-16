class CourtRepository {
  /** @returns {Promise<Court|null>} */
  async findById(id)            { throw new Error('Not implemented'); }

  /** @returns {Promise<Court[]>} */
  async findByVenue(venueId)    { throw new Error('Not implemented'); }

  /** @returns {Promise<Court[]>} */
  async findBySport(sportId)    { throw new Error('Not implemented'); }

  /** @returns {Promise<Court>} */
  async save(court)             { throw new Error('Not implemented'); }

  /** @returns {Promise<Court>} */
  async update(court)           { throw new Error('Not implemented'); }
}

module.exports = CourtRepository;
