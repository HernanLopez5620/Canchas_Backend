const bcrypt = require('bcryptjs');
const User = require('../domain/User');
const { UserAlreadyExists } = require('../domain/exceptions/UserExceptions');

class RegisterUser {
    /**
     * @param {import('../domain/UserRepository')} userRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * @param {{ name: string, email: string, password: string, phone?: string, role?: string }} dto
     * @returns {Promise<{ user: object }>}
     */
    async execute({ name, email, password, phone, role = 'player' }) {
        // 1. Verificar que el email no esté en uso
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new UserAlreadyExists();

        // 2. Hashear contraseña
        const passwordHash = await bcrypt.hash(password, 12);

        // 3. Crear entidad de dominio
        const user = new User({ name, email, phone, passwordHash, role });

        // 4. Persistir
        const saved = await this.userRepository.save(user);

        return { user: saved.toPublic() };
    }
}

module.exports = RegisterUser;
