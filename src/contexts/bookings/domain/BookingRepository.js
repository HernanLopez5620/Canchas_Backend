class BookingRepository {
    async findById(id)               { throw new Error('Not implemented'); }
    async findByUser(userId)         { throw new Error('Not implemented'); }
    async hasConflict({ courtId, bookingDate, startTime, endTime }) { throw new Error('Not implemented'); }
    async getSlots({ courtId, date }) { throw new Error('Not implemented'); }
    async save(booking)              { throw new Error('Not implemented'); }
    async updateStatus({ bookingId, status, reason }) { throw new Error('Not implemented'); }
    async expireOldPending()         { throw new Error('Not implemented'); }
}

module.exports = BookingRepository;