const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { InvalidCredentials, UserInactive } = require('../domain/exceptions/UserExceptions');

class LoginUser {
    /**
     * @param {import('../domain/UserRepository')} userRepository
     * @param {{ jwtSecret: string, jwtExpiresIn: string }} config
     */
    constructor(userRepository, config) {
        this.userRepository = userRepository;
        this.config = config;
    }

    /**
     * @param {{ email: string, password: string }} dto
     * @returns {Promise<{ token: string, user: object }>}
     */
    async execute({ email, password }) {
        // 1. Buscar usuario
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new InvalidCredentials();

        // 2. Verificar que la cuenta esté activa
        if (!user.isActive) throw new UserInactive();

        // 3. Comparar contraseña
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new InvalidCredentials();

        // 4. Generar JWT
        const token = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            this.config.jwtSecret,
            { expiresIn: this.config.jwtExpiresIn }
        );

        return { token, user: user.toPublic() };
    }
}

module.exports = LoginUser;
