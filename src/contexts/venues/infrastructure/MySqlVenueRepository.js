const VenueRepository = require('../domain/VenueRepository');
const Venue           = require('../domain/Venue');
const { getPool }     = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlVenueRepository extends VenueRepository {
    _map(row) {
        if (!row) return null;
        return new Venue({
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
        });
    }

    async findById(id) {
        const [rows] = await getPool().query(
            'SELECT * FROM venues WHERE id = ? LIMIT 1', [id]
        );
        return this._map(rows[0]);
    }

    async findByCity(city) {
        const [rows] = await getPool().query(
            `SELECT * FROM venues
             WHERE LOWER(city) = LOWER(?) AND is_active = 1`,
            [city]
        );
        return rows.map(r => this._map(r));
    }

    async findByOwner(ownerId) {
        const [rows] = await getPool().query(
            'SELECT * FROM venues WHERE owner_id = ?', [ownerId]
        );
        return rows.map(r => this._map(r));
    }

    async save(venue) {
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
        });
    }

    async update(venue) {
        await getPool().query(
            `UPDATE venues
             SET name=?, description=?, address=?, phone=?, is_active=?
             WHERE id=?`,
            [venue.name, venue.description, venue.address,
             venue.phone, venue.isActive, venue.id]
        );
        return venue;
    }
}

module.exports = MySqlVenueRepository;
