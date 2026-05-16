const CourtRepository = require('../domain/CourtRepository');
const Court           = require('../domain/Court');
const { getPool }     = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlCourtRepository extends CourtRepository {
  _map(row) {
    if (!row) return null;
    return new Court({
      id:          row.id,
      venueId:     row.venue_id,
      sportId:     row.sport_id,
      name:        row.name,
      description: row.description,
      surface:     row.surface,
      isIndoor:    Boolean(row.is_indoor),
      basePrice:   parseFloat(row.base_price),
      capacity:    row.capacity,
      isActive:    Boolean(row.is_active),
      createdAt:   row.created_at,
    });
  }

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT c.*, s.name as sport_name 
       FROM courts c
       JOIN sports s ON s.id = c.sport_id
       WHERE c.id = ? AND c.is_active = 1 LIMIT 1`,
      [id]
    );
    return this._map(rows[0]);
  }

  async findByVenue(venueId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT c.*, s.name as sport_name
       FROM courts c
       JOIN sports s ON s.id = c.sport_id
       WHERE c.venue_id = ? AND c.is_active = 1
       ORDER BY c.name ASC`,
      [venueId]
    );
    return rows.map(r => this._map(r));
  }

  async findBySport(sportId) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM courts WHERE sport_id = ? AND is_active = 1',
      [sportId]
    );
    return rows.map(r => this._map(r));
  }

  async save(court) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO courts (venue_id, sport_id, name, description, surface, is_indoor, base_price, capacity, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [court.venueId, court.sportId, court.name, court.description, court.surface, court.isIndoor, court.basePrice, court.capacity, court.isActive]
    );
    return this._map({
      ...court,
      id:         result.insertId,
      venue_id:   court.venueId,
      sport_id:   court.sportId,
      is_indoor:  court.isIndoor,
      base_price: court.basePrice,
      is_active:  court.isActive,
      created_at: court.createdAt,
    });
  }

  async update(court) {
    const pool = getPool();
    await pool.query(
      `UPDATE courts SET name = ?, description = ?, surface = ?, is_indoor = ?, base_price = ?, capacity = ?, is_active = ?
       WHERE id = ?`,
      [court.name, court.description, court.surface, court.isIndoor, court.basePrice, court.capacity, court.isActive, court.id]
    );
    return court;
  }
}

module.exports = MySqlCourtRepository;
