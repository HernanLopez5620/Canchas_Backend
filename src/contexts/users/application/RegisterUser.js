const bcrypt = require('bcryptjs');
<<<<<<< HEAD
const User   = require('../domain/User');
const { UserAlreadyExists } = require('../domain/exceptions/UserExceptions');

class RegisterUser {
=======
const User = require('../domain/User');
const { UserAlreadyExists } = require('../domain/exceptions/UserExceptions');

class RegisterUser {
    /**
     * @param {import('../domain/UserRepository')} userRepository
     */
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

<<<<<<< HEAD
    async execute({ name, email, phone, password, role }) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new UserAlreadyExists();

        const hashed = await bcrypt.hash(password, 12);
        const user   = new User({ name, email, phone, password: hashed, role });
        const saved  = await this.userRepository.save(user);
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

        return { user: saved.toPublic() };
    }
}

<<<<<<< HEAD
module.exports = RegisterUser;
=======
module.exports = RegisterUser;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
