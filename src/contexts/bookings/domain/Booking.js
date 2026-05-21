class Booking {
  constructor({
    id, courtId, userId, bookingDate, startTime, endTime,
    totalPrice, platformFee, status, cancelledReason,
    notes, expiresAt, createdAt, confirmedAt
  }) {
    this.id               = id;
    this.courtId          = courtId;
    this.userId           = userId;
    this.bookingDate      = bookingDate;
    this.startTime        = startTime;
    this.endTime          = endTime;
    this.totalPrice       = totalPrice;
    this.platformFee      = platformFee ?? 0;
    this.status           = status ?? 'pending';
    this.cancelledReason  = cancelledReason ?? null;
    this.notes            = notes ?? null;
    this.expiresAt        = expiresAt ?? null;
    this.createdAt        = createdAt ?? new Date();
    this.confirmedAt      = confirmedAt ?? null;
  }

  isPending()    { return this.status === 'pending'; }
  isConfirmed()  { return this.status === 'confirmed'; }
  isCancelled()  { return this.status.startsWith('cancelled'); }
  isExpired()    { return this.status === 'expired'; }
  isCompleted()  { return this.status === 'completed'; }

  canBeCancelledByUser() {
    return this.status === 'pending' || this.status === 'confirmed';
  }

  toPublic() {
    return {
      id:              this.id,
      courtId:         this.courtId,
      userId:          this.userId,
      bookingDate:     this.bookingDate,
      startTime:       this.startTime,
      endTime:         this.endTime,
      totalPrice:      this.totalPrice,
      platformFee:     this.platformFee,
      status:          this.status,
      cancelledReason: this.cancelledReason,
      notes:           this.notes,
      expiresAt:       this.expiresAt,
      createdAt:       this.createdAt,
      confirmedAt:     this.confirmedAt,
    };
  }
}

module.exports = Booking;
