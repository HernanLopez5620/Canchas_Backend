class VenueRepository {
    /** @returns {Promise<Venue|null>} */
    async findById(id) { throw new Error('Not implemented'); }

    /** @returns {Promise<Venue[]>} */
    async findByCity(city) { throw new Error('Not implemented'); }

    /** @returns {Promise<Venue[]>} */
    async findByOwner(ownerId) { throw new Error('Not implemented'); }

    /** @returns {Promise<Venue>} */
    async save(venue) { throw new Error('Not implemented'); }

    /** @returns {Promise<Venue>} */
    async update(venue) { throw new Error('Not implemented'); }
}

module.exports = VenueRepository;
