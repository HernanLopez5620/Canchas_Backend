class BookingRepository {
<<<<<<< HEAD
    async findById(id)               { throw new Error('Not implemented'); }
    async findByUser(userId)         { throw new Error('Not implemented'); }
    async hasConflict({ courtId, bookingDate, startTime, endTime }) { throw new Error('Not implemented'); }
    async getSlots({ courtId, date }) { throw new Error('Not implemented'); }
    async save(booking)              { throw new Error('Not implemented'); }
    async updateStatus({ bookingId, status, reason }) { throw new Error('Not implemented'); }
    async expireOldPending()         { throw new Error('Not implemented'); }
}

module.exports = BookingRepository;
=======
  /** @returns {Promise<Booking|null>} */
  async findById(id)                              { throw new Error('Not implemented'); }

  /** @returns {Promise<Booking[]>} */
  async findByUser(userId)                        { throw new Error('Not implemented'); }

  /** @returns {Promise<Booking[]>} */
  async findByCourt(courtId, date)                { throw new Error('Not implemented'); }

  /** @returns {Promise<boolean>} */
  async isSlotTaken(courtId, date, startTime)     { throw new Error('Not implemented'); }

  /** @returns {Promise<Booking>} */
  async save(booking)                             { throw new Error('Not implemented'); }

  /** @returns {Promise<Booking>} */
  async update(booking)                           { throw new Error('Not implemented'); }

  /** @returns {Promise<void>} */
  async expireOldPending()                        { throw new Error('Not implemented'); }
}

module.exports = BookingRepository;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
