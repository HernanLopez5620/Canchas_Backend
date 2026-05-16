class BookingRepository {
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
