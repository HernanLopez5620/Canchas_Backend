const BookingRepository = require('../domain/BookingRepository');
const Booking           = require('../domain/Booking');
const { getPool }       = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlBookingRepository extends BookingRepository {
  _map(row) {
    if (!row) return null;
    return new Booking({
      id:              row.id,
      courtId:         row.court_id,
      userId:          row.user_id,
      bookingDate:     row.booking_date,
      startTime:       row.start_time,
      endTime:         row.end_time,
      totalPrice:      parseFloat(row.total_price),
      platformFee:     parseFloat(row.platform_fee),
      status:          row.status,
      cancelledReason: row.cancelled_reason,
      notes:           row.notes,
      expiresAt:       row.expires_at,
      createdAt:       row.created_at,
      confirmedAt:     row.confirmed_at,
    });
  }

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE id = ? LIMIT 1',
      [id]
    );
    return this._map(rows[0]);
  }

  async findByUser(userId) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC, start_time DESC',
      [userId]
    );
    return rows.map(r => this._map(r));
  }

  async findByCourt(courtId, date) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE court_id = ? AND booking_date = ?',
      [courtId, date]
    );
    return rows.map(r => this._map(r));
  }

  async isSlotTaken(courtId, date, startTime) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id FROM bookings 
       WHERE court_id = ? AND booking_date = ? AND start_time = ?
       AND status NOT IN ('cancelled_user', 'cancelled_owner', 'expired')
       LIMIT 1`,
      [courtId, date, startTime]
    );
    return rows.length > 0;
  }

  async save(booking) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO bookings 
       (court_id, user_id, booking_date, start_time, end_time, total_price, platform_fee, status, notes, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.courtId, booking.userId, booking.bookingDate,
        booking.startTime, booking.endTime, booking.totalPrice,
        booking.platformFee, booking.status, booking.notes, booking.expiresAt,
      ]
    );
    return this._map({
      ...booking,
      id:           result.insertId,
      court_id:     booking.courtId,
      user_id:      booking.userId,
      booking_date: booking.bookingDate,
      start_time:   booking.startTime,
      end_time:     booking.endTime,
      total_price:  booking.totalPrice,
      platform_fee: booking.platformFee,
      expires_at:   booking.expiresAt,
      created_at:   booking.createdAt,
      confirmed_at: booking.confirmedAt,
      cancelled_reason: booking.cancelledReason,
    });
  }

  async update(booking) {
    const pool = getPool();
    await pool.query(
      `UPDATE bookings 
       SET status = ?, cancelled_reason = ?, confirmed_at = ?, notes = ?
       WHERE id = ?`,
      [booking.status, booking.cancelledReason, booking.confirmedAt, booking.notes, booking.id]
    );
    return booking;
  }

  async expireOldPending() {
    const pool = getPool();
    await pool.query(
      `UPDATE bookings 
       SET status = 'expired'
       WHERE status = 'pending' AND expires_at < NOW()`
    );
  }
}

module.exports = MySqlBookingRepository;
