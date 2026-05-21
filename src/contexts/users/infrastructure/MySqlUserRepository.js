const UserRepository = require('../domain/UserRepository');
const User           = require('../domain/User');
const { getPool }    = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlUserRepository extends UserRepository {
    _map(row) {
        if (!row) return null;
        return new User({
            id:        row.id,
            name:      row.name,
            email:     row.email,
            phone:     row.phone,
            password:  row.password_hash,
            role:      row.role,
            avatarUrl: row.avatar_url,
            isActive:  Boolean(row.is_active),
            createdAt: row.created_at,
        });
    }

    async findByEmail(email) {
        const [rows] = await getPool().query(
            'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
        );
        return this._map(rows[0]);
    }

    async findById(id) {
        const [rows] = await getPool().query(
            'SELECT * FROM users WHERE id = ? LIMIT 1', [id]
        );
        return this._map(rows[0]);
    }

    async save(user) {
        const [result] = await getPool().query(
            `INSERT INTO users (name, email, phone, password_hash, role, is_active)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user.name, user.email, user.phone,
             user.password, user.role, user.isActive]
        );
        return this._map({
            id:            result.insertId,
            name:          user.name,
            email:         user.email,
            phone:         user.phone,
            password_hash: user.password,
            role:          user.role,
            avatar_url:    user.avatarUrl,
            is_active:     user.isActive,
            created_at:    user.createdAt,
        });
    }
}

module.exports = MySqlUserRepository;