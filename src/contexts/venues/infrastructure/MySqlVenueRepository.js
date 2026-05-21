const VenueRepository = require('../domain/VenueRepository');
<<<<<<< HEAD
const Venue           = require('../domain/Venue');
const { getPool }     = require('../../../shared/infrastructure/database/MySqlConnection');
=======
const Venue = require('../domain/Venue');
const { getPool } = require('../../../shared/infrastructure/database/MySqlConnection');
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

class MySqlVenueRepository extends VenueRepository {
    _map(row) {
        if (!row) return null;
        return new Venue({
<<<<<<< HEAD
            id:          row.id,
            ownerId:     row.owner_id,
            name:        row.name,
            description: row.description,
            address:     row.address,
            city:        row.city,
            lat:         row.lat,
            lng:         row.lng,
            phone:       row.phone,
            isActive:    Boolean(row.is_active),
            createdAt:   row.created_at,
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        });
    }

    async findById(id) {
<<<<<<< HEAD
        const [rows] = await getPool().query(
            'SELECT * FROM venues WHERE id = ? LIMIT 1', [id]
=======
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE id = ? AND is_active = 1 LIMIT 1',
            [id]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return this._map(rows[0]);
    }

    async findByCity(city) {
<<<<<<< HEAD
        const [rows] = await getPool().query(
            `SELECT * FROM venues
             WHERE LOWER(city) = LOWER(?) AND is_active = 1`,
            [city]
=======
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE city LIKE ? AND is_active = 1 ORDER BY name ASC',
            [`%${city}%`]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return rows.map(r => this._map(r));
    }

    async findByOwner(ownerId) {
<<<<<<< HEAD
        const [rows] = await getPool().query(
            'SELECT * FROM venues WHERE owner_id = ?', [ownerId]
=======
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM venues WHERE owner_id = ? ORDER BY created_at DESC',
            [ownerId]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return rows.map(r => this._map(r));
    }

    async save(venue) {
<<<<<<< HEAD
        const [result] = await getPool().query(
            `INSERT INTO venues
             (owner_id, name, description, address, city, lat, lng, phone, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [venue.ownerId, venue.name, venue.description, venue.address,
             venue.city, venue.lat, venue.lng, venue.phone, venue.isActive]
        );
        return this._map({
            id:          result.insertId,
            owner_id:    venue.ownerId,
            name:        venue.name,
            description: venue.description,
            address:     venue.address,
            city:        venue.city,
            lat:         venue.lat,
            lng:         venue.lng,
            phone:       venue.phone,
            is_active:   venue.isActive,
            created_at:  venue.createdAt,
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        });
    }

    async update(venue) {
<<<<<<< HEAD
        await getPool().query(
            `UPDATE venues
             SET name=?, description=?, address=?, phone=?, is_active=?
             WHERE id=?`,
            [venue.name, venue.description, venue.address,
             venue.phone, venue.isActive, venue.id]
=======
        const pool = getPool();
        await pool.query(
            `UPDATE venues SET name = ?, description = ?, address = ?, city = ?, lat = ?, lng = ?, phone = ?, is_active = ?
       WHERE id = ?`,
            [venue.name, venue.description, venue.address, venue.city, venue.lat, venue.lng, venue.phone, venue.isActive, venue.id]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return venue;
    }
}

module.exports = MySqlVenueRepository;
