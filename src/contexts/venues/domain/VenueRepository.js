class VenueRepository {
<<<<<<< HEAD
    async findById(id)         { throw new Error('Not implemented'); }
    async findByCity(city)     { throw new Error('Not implemented'); }
    async findByOwner(ownerId) { throw new Error('Not implemented'); }
    async save(venue)          { throw new Error('Not implemented'); }
    async update(venue)        { throw new Error('Not implemented'); }
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
}

module.exports = VenueRepository;
