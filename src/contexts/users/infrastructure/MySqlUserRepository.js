const UserRepository = require('../domain/UserRepository');
const User = require('../domain/User');
const { getPool } = require('../../../shared/infrastructure/database/MySqlConnection');

class MySqlUserRepository extends UserRepository {
    _map(row) {
        if (!row) return null;
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash,
            role: row.role,
            avatarUrl: row.avatar_url,
            isActive: Boolean(row.is_active),
            createdAt: row.created_at,
        });
    }

    async findById(id) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [id]
        );
        return this._map(rows[0]);
    }

    async findByEmail(email) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email]
        );
        return this._map(rows[0]);
    }

    async save(user) {
        const pool = getPool();
        const [result] = await pool.query(
            `INSERT INTO users (name, email, phone, password_hash, role, avatar_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.name, user.email, user.phone, user.passwordHash, user.role, user.avatarUrl, user.isActive]
        );
        return this._map({
            ...user,
            id: result.insertId,
            password_hash: user.passwordHash,
            avatar_url: user.avatarUrl,
            is_active: user.isActive,
            created_at: user.createdAt,
        });
    }

    async update(user) {
        const pool = getPool();
        await pool.query(
            `UPDATE users SET name = ?, email = ?, phone = ?, password_hash = ?, role = ?, avatar_url = ?, is_active = ?
       WHERE id = ?`,
            [user.name, user.email, user.phone, user.passwordHash, user.role, user.avatarUrl, user.isActive, user.id]
        );
        return user;
    }
}

module.exports = MySqlUserRepository;
