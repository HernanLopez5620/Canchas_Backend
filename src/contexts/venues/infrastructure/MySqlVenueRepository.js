const VenueRepository = require('../domain/VenueRepository');
const Venue = require('../domain/Venue');
const { getPool } = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlVenueRepository extends VenueRepository {
    _map(row) {
        if (!row) return null;
        return new Venue({
            id: row.id,
            ownerId: row.owner_id,
            name: row.name,
            description: row.description,
            address: row.address,
            city: row.city,
            lat: row.lat,
            lng: row.lng,
            phone: row.phone,
            isActive: Boolean(row.is_active),
            createdAt: row.created_at,
        });
    }

    async findById(id) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE id = ? AND is_active = 1 LIMIT 1',
            [id]
        );
        return this._map(rows[0]);
    }

    async findByCity(city) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE city LIKE ? AND is_active = 1 ORDER BY name ASC',
            [`%${city}%`]
        );
        return rows.map(r => this._map(r));
    }

    async findByOwner(ownerId) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE owner_id = ? ORDER BY created_at DESC',
            [ownerId]
        );
        return rows.map(r => this._map(r));
    }

    async save(venue) {
        const pool = getPool();
        const [result] = await pool.query(
            `INSERT INTO venues (owner_id, name, description, address, city, lat, lng, phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [venue.ownerId, venue.name, venue.description, venue.address, venue.city, venue.lat, venue.lng, venue.phone, venue.isActive]
        );
        return this._map({
            ...venue,
            id: result.insertId,
            owner_id: venue.ownerId,
            is_active: venue.isActive,
            created_at: venue.createdAt,
        });
    }

    async update(venue) {
        const pool = getPool();
        await pool.query(
            `UPDATE venues SET name = ?, description = ?, address = ?, city = ?, lat = ?, lng = ?, phone = ?, is_active = ?
       WHERE id = ?`,
            [venue.name, venue.description, venue.address, venue.city, venue.lat, venue.lng, venue.phone, venue.isActive, venue.id]
        );
        return venue;
    }
}

module.exports = MySqlVenueRepository;
