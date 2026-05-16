/**
 * Puerto (interfaz) del repositorio de usuarios.
 * La capa de dominio solo conoce este contrato,
 * nunca la implementación concreta de MySQL.
 */
class UserRepository {
    /** @returns {Promise<User|null>} */
    async findById(id) { throw new Error('Not implemented'); }

    /** @returns {Promise<User|null>} */
    async findByEmail(email) { throw new Error('Not implemented'); }

    /** @returns {Promise<User>} */
    async save(user) { throw new Error('Not implemented'); }

    /** @returns {Promise<User>} */
    async update(user) { throw new Error('Not implemented'); }
}

module.exports = UserRepository;