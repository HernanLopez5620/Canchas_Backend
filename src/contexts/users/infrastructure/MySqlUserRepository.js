const UserRepository = require('../domain/UserRepository');
<<<<<<< HEAD
const User           = require('../domain/User');
const { getPool }    = require('../../../shared/infrastructure/database/MySqlConnection');
=======
const User = require('../domain/User');
const { getPool } = require('../../../shared/infrastructure/database/MySqlConnection');
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

class MySqlUserRepository extends UserRepository {
    _map(row) {
        if (!row) return null;
        return new User({
<<<<<<< HEAD
            id:        row.id,
            name:      row.name,
            email:     row.email,
            phone:     row.phone,
            password:  row.password_hash,
            role:      row.role,
            avatarUrl: row.avatar_url,
            isActive:  Boolean(row.is_active),
=======
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash,
            role: row.role,
            avatarUrl: row.avatar_url,
            isActive: Boolean(row.is_active),
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
            createdAt: row.created_at,
        });
    }

<<<<<<< HEAD
    async findByEmail(email) {
        const [rows] = await getPool().query(
            'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
=======
    async findById(id) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [id]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return this._map(rows[0]);
    }

<<<<<<< HEAD
    async findById(id) {
        const [rows] = await getPool().query(
            'SELECT * FROM users WHERE id = ? LIMIT 1', [id]
=======
    async findByEmail(email) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email]
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        );
        return this._map(rows[0]);
    }

    async save(user) {
<<<<<<< HEAD
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
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
